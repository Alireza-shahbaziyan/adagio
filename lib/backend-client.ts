
import { NextRequest, NextResponse } from "next/server";
import { backend, frontend, referer } from "@/utils/getURL";
import { forwardSetCookie } from "@/utils/forwardSetCookie";

const MUTATING_METHODS = new Set([
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
]);

function getCookieValue(
  cookieHeader: string,
  name: string,
): string | null {
  const cookie = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`));

  if (!cookie) return null;

  return decodeURIComponent(
    cookie.slice(name.length + 1),
  );
}

function getSetCookieHeaders(
  response: Response,
): string[] {
  return response.headers.getSetCookie?.() ?? [];
}

function getCookieFromSetCookie(
  setCookies: string[],
  name: string,
): string | null {
  for (const cookie of setCookies) {
    const prefix = `${name}=`;

    if (cookie.startsWith(prefix)) {
      return decodeURIComponent(
        cookie.slice(prefix.length).split(";")[0],
      );
    }
  }

  return null;
}

async function ensureCsrf(
  req: NextRequest,
): Promise<{
  token: string | null;
  cookieHeader: string;
  csrfResponse: Response | null;
}> {
  let cookieHeader =
    req.headers.get("cookie") ?? "";

  // 1. CSRF cookie already exists
  const existingToken = getCookieValue(
    cookieHeader,
    "csrftoken",
  );

  if (existingToken) {
    return {
      token: existingToken,
      cookieHeader,
      csrfResponse: null,
    };
  }

  // 2. Ask Django for a CSRF cookie
  const csrfResponse = await fetch(
    `${backend}/api/auth/csrf/`,
    {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    },
  );

  if (!csrfResponse.ok) {
    return {
      token: null,
      cookieHeader,
      csrfResponse,
    };
  }

  // 3. Extract Set-Cookie from Django response
  const setCookies =
    getSetCookieHeaders(csrfResponse);

  const csrfToken = getCookieFromSetCookie(
    setCookies,
    "csrftoken",
  );

  // 4. Add the new CSRF cookie to the request
  // that we're going to send to Django.
  if (csrfToken) {
    cookieHeader = cookieHeader
      ? `${cookieHeader}; csrftoken=${encodeURIComponent(csrfToken)}`
      : `csrftoken=${encodeURIComponent(csrfToken)}`;
  }

  return {
    token: csrfToken,
    cookieHeader,
    csrfResponse,
  };
}

type BackendFetchOptions = Omit<
  RequestInit,
  "body" | "headers"
> & {
  body?: unknown;
  headers?: HeadersInit;
  /** Detail used when the backend fails without a JSON body. */
  fallbackDetail?: string;
};

export async function backendFetch(
  req: NextRequest,
  path: string,
  options: BackendFetchOptions = {},
): Promise<NextResponse> {
  try {

    const method = (
      options.method ?? "GET"
    ).toString().toUpperCase();

    let cookieHeader =
      req.headers.get("cookie") ?? "";

    let csrfToken: string | null = null;
    let csrfResponse: Response | null = null;

    // ----------------------------------------
    // CSRF
    // ----------------------------------------

    if (MUTATING_METHODS.has(method)) {
      const csrf = await ensureCsrf(req);

      csrfToken = csrf.token;
      cookieHeader = csrf.cookieHeader;
      csrfResponse = csrf.csrfResponse;

      // CSRF endpoint itself failed
      if (!csrfToken) {
        if (csrfResponse) {
          const data = await csrfResponse
            .json()
            .catch(() => null);

          const response = NextResponse.json(
            data ?? {
              detail:
                "Unable to initialize CSRF token",
            },
            {
              status: csrfResponse.status,
            },
          );

          forwardSetCookie(
            csrfResponse,
            response,
          );

          return response;
        }

        return NextResponse.json(
          {
            detail: "Unable to initialize CSRF token",
          },
          { status: 500 },
        );
      }
    }

    // ----------------------------------------
    // Headers
    // ----------------------------------------

    const headers = new Headers(
      options.headers,
    );
    
    headers.set("Referer", referer ?? frontend ?? "");

    if (cookieHeader) {
      headers.set("Cookie", cookieHeader);
    }

    if (csrfToken) {
      headers.set("X-CSRFToken", csrfToken);
    }

    // Only set JSON content type when body exists
    // and caller hasn't already specified it.
    if (
      options.body !== undefined &&
      !(options.body instanceof FormData) &&
      !headers.has("Content-Type")
    ) {
      headers.set(
        "Content-Type",
        "application/json",
      );
    }

    // ----------------------------------------
    // Body
    // ----------------------------------------

    let body: BodyInit | undefined;

    if (options.body !== undefined) {
      if (
        typeof options.body === "string" ||
        options.body instanceof FormData ||
        options.body instanceof Blob ||
        options.body instanceof ArrayBuffer
      ) {
        body = options.body;
      } else {
        body = JSON.stringify(options.body);
      }
    }

    // ----------------------------------------
    // Backend request
    // ----------------------------------------

    const response = await fetch(
      `${backend}${path}`,
      {
        ...options,
        method,
        headers,
        body,
        cache: "no-store",
      },
    );

    // ----------------------------------------
    // Response
    // ----------------------------------------

    const text = await response.text();

    let data: unknown = null;

    try {
      data = text
        ? JSON.parse(text)
        : null;
    } catch {
      data = text || null;
    }

    const payload =
      data ??
      (!response.ok && options.fallbackDetail
        ? { detail: options.fallbackDetail }
        : null);

    const nextResponse = NextResponse.json(
      payload,
      {
        status: response.status,
      },
    );

    // CSRF endpoint may have created csrftoken
    if (csrfResponse) {
      forwardSetCookie(
        csrfResponse,
        nextResponse,
      );
    }

    // Backend itself may set authentication/session cookies
    forwardSetCookie(
      response,
      nextResponse,
    );

    return nextResponse;
  } catch (error) {
    console.error("backendFetch error:", error);

    return NextResponse.json(
      {
        detail: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

export type BackendProxyHeaders =
  | {
      ok: true;
      headers: Headers;
      csrfResponse: Response | null;
    }
  | {
      ok: false;
      response: NextResponse;
    };

/**
 * Shared request-header preparation for hand-rolled backend proxies.
 *
 * Enforces the CSRF contract consistently: every non-GET request gets a
 * guaranteed `X-CSRFToken` (initialized/refreshed via `ensureCsrf` when the
 * cookie is missing or stale), the full cookie header, and the `Referer`
 * Django's CSRF checks expect. GET requests only forward cookies and never
 * require a token. When the CSRF token cannot be initialized the returned
 * `response` should be sent as-is.
 */
export async function buildProxyHeaders(
  req: NextRequest,
  extraHeaders?: HeadersInit,
): Promise<BackendProxyHeaders> {
  const headers = new Headers(extraHeaders);
  headers.set("Referer", referer ?? frontend ?? "");

  const method = (req.method ?? "GET").toUpperCase();

  if (!MUTATING_METHODS.has(method)) {
    const cookieHeader = req.headers.get("cookie");

    if (cookieHeader) {
      headers.set("Cookie", cookieHeader);
    }

    return { ok: true, headers, csrfResponse: null };
  }

  const csrf = await ensureCsrf(req);

  if (!csrf.token) {
    if (csrf.csrfResponse) {
      const data = await csrf.csrfResponse
        .json()
        .catch(() => null);

      const response = NextResponse.json(
        data ?? { detail: "Unable to initialize CSRF token" },
        { status: csrf.csrfResponse.status },
      );

      forwardSetCookie(csrf.csrfResponse, response);

      return { ok: false, response };
    }

    return {
      ok: false,
      response: NextResponse.json(
        { detail: "Unable to initialize CSRF token" },
        { status: 500 },
      ),
    };
  }

  headers.set("Cookie", csrf.cookieHeader);
  headers.set("X-CSRFToken", csrf.token);

  return { ok: true, headers, csrfResponse: csrf.csrfResponse };
}

