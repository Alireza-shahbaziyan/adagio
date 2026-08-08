import { NextResponse } from "next/server";

/**
 * Forwards every `Set-Cookie` header from a backend fetch Response onto a
 * NextResponse. Using `Headers.get("set-cookie")` only returns a single,
 * comma-joined string when the backend sends multiple cookies (e.g. an
 * access token + a refresh token), which corrupts the cookies and breaks
 * the session. `getSetCookie()` returns each cookie separately so they can
 * be appended individually.
 */
export function forwardSetCookie(backendRes: Response, response: NextResponse) {
  const cookies = backendRes.headers.getSetCookie?.() ?? [];
  for (const cookie of cookies) {
    response.headers.append("set-cookie", cookie);
  }
  return response;
}
