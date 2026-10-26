const SAFE_REDIRECT_ORIGIN = "https://adagio.local";

/**
 * Returns a same-origin relative path from a `next` query parameter.
 * Anything else (absolute URLs, protocol-relative URLs, backslash tricks)
 * is rejected so login redirects can never become an open redirect.
 */
export function getSafeNextPath(
  value: string | string[] | null | undefined,
): string | null {
  const raw = Array.isArray(value) ? value[0] : value;

  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return null;
  }

  try {
    const url = new URL(raw, SAFE_REDIRECT_ORIGIN);

    if (url.origin !== SAFE_REDIRECT_ORIGIN) {
      return null;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}
