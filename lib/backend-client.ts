
import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/utils/getURL";
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
    `${backend}/auth/csrf/`,
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
            detail:
              "Unable to initialize CSRF token",
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

    const nextResponse = NextResponse.json(
      data,
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

