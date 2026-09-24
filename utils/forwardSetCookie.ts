import { NextRequest, NextResponse } from "next/server";
import { frontend } from "@/utils/getURL";

/**
 * Forwards every `Set-Cookie` header from a backend fetch Response onto a
 * NextResponse. Using `Headers.get("set-cookie")` only returns a single,
 * comma-joined string when the backend sends multiple cookies (e.g. an
 * access token + a refresh token), which corrupts the cookies and breaks
 * the session. `getSetCookie()` returns each cookie separately so they can
 * be appended individually.
 *
 * CSRFTOKEN NORMALISATION
 * -----------------------
 * The browser can end up holding two `csrftoken` cookies for this site — a
 * host-only one (`Domain=adagiostyle.ir`) and a domain one
 * (`Domain=.adagiostyle.ir`) — because this proxy forwards csrftoken
 * Set-Cookie headers from backends with and without `CSRF_COOKIE_DOMAIN`.
 * Both cookies are sent on every request (e.g. `POST /api/orders/`), so the
 * backend receives a duplicate cookie name and CSRF verification becomes
 * order-dependent.
 *
 * Two guarantees keep exactly one csrftoken cookie:
 *  1. When a backend csrftoken is forwarded, the *other* cookie identity is
 *     deleted first, so only the backend's canonical cookie can exist.
 *  2. When the incoming request already carries duplicate csrftoken values
 *     (pass `req`), both identities are deleted and re-created once with the
 *     first value the browser sent — the same value `getCookieValue` and the
 *     `X-CSRFToken` header read.
 */

const CSRF_COOKIE = "csrftoken";
// Matches Django's CSRF_COOKIE_AGE (observed: Max-Age=31449600).
const CSRF_MAX_AGE = 31449600;

const csrfForwarded = new WeakSet<NextResponse>();
const csrfCollapsed = new WeakSet<NextResponse>();

function isCsrfCookie(setCookie: string): boolean {
  return setCookie.startsWith(`${CSRF_COOKIE}=`);
}

function hasDomainAttribute(setCookie: string): boolean {
  return /(?:^|;)\s*domain=/i.test(setCookie);
}

/**
 * Hostname used for the canonical domain-scoped csrftoken cookie. Derived
 * from the frontend base URL (e.g. `adagiostyle.ir`). Localhost/IP frontends
 * return `null` because browsers reject (or do not need) a Domain attribute
 * there — in that case only the host-only identity is used.
 */
function canonicalCsrfDomain(): string | null {
  if (!frontend) return null;

  try {
    const host = new URL(frontend).hostname;

    if (!host || host === "localhost" || host === "127.0.0.1") return null;
    if (host.includes(":")) return null; // IPv6 literal
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return null; // IPv4 literal

    return host;
  } catch {
    return null;
  }
}

function secureAttribute(): string {
  return frontend && frontend.startsWith("https:") ? "; Secure" : "";
}

function deleteHostOnlyCsrf(response: NextResponse): void {
  response.headers.append(
    "set-cookie",
    `${CSRF_COOKIE}=; Max-Age=0; Path=/`,
  );
}

function deleteDomainCsrf(response: NextResponse): void {
  const domain = canonicalCsrfDomain();

  if (!domain) return;

  response.headers.append(
    "set-cookie",
    `${CSRF_COOKIE}=; Max-Age=0; Path=/; Domain=${domain}`,
  );
}

/**
 * Collapses a browser state that already holds two csrftoken cookies: the
 * incoming Cookie header then contains `csrftoken=...; csrftoken=...`.
 * Both identities are deleted and the first value the browser sent is
 * re-created as a single canonical cookie.
 */
function collapseDuplicateCsrf(
  req: NextRequest,
  response: NextResponse,
): void {
  if (csrfCollapsed.has(response)) return;

  const cookieHeader = req.headers.get("cookie") ?? "";
  const occurrences = cookieHeader.match(/(?:^|;\s*)csrftoken=/g);

  if (!occurrences || occurrences.length < 2) return;

  csrfCollapsed.add(response);

  const first = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${CSRF_COOKIE}=`));

  const value = first ? first.slice(CSRF_COOKIE.length + 1) : "";

  // Delete both possible identities, then re-create exactly one.
  deleteHostOnlyCsrf(response);
  deleteDomainCsrf(response);

  if (!value) return;

  const domain = canonicalCsrfDomain();
  const secure = secureAttribute();

  const canonical = domain
    ? `${CSRF_COOKIE}=${value}; Max-Age=${CSRF_MAX_AGE}; Path=/; SameSite=Lax${secure}; Domain=${domain}`
    : `${CSRF_COOKIE}=${value}; Max-Age=${CSRF_MAX_AGE}; Path=/; SameSite=Lax${secure}`;

  response.headers.append("set-cookie", canonical);
}

export function forwardSetCookie(
  backendRes: Response,
  response: NextResponse,
  req?: NextRequest,
) {
  if (req) {
    collapseDuplicateCsrf(req, response);
  }

  const cookies = backendRes.headers.getSetCookie?.() ?? [];

  // Only the freshest csrftoken the backend sent is forwarded; everything
  // else (session, cart_token, ...) is passed through untouched.
  let csrfCookie: string | null = null;

  for (const cookie of cookies) {
    if (isCsrfCookie(cookie)) {
      csrfCookie = cookie;
      continue;
    }

    response.headers.append("set-cookie", cookie);
  }

  if (csrfCookie) {
    if (!csrfForwarded.has(response)) {
      csrfForwarded.add(response);

      // Delete the cookie identity the backend is NOT using so a stale
      // csrftoken from the other identity cannot survive alongside it.
      if (hasDomainAttribute(csrfCookie)) {
        deleteHostOnlyCsrf(response);
      } else {
        deleteDomainCsrf(response);
      }
    }

    response.headers.append("set-cookie", csrfCookie);
  }

  return response;
}
