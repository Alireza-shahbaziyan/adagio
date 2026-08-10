import { NextRequest, NextResponse } from "next/server";

// Must match the backend media hosts allowed in next.config.ts images.remotePatterns
const ALLOWED_HOSTS = new Set(["api.adagiostyle.ir", "185.110.191.14"]);

export async function GET(req: NextRequest) {
  const src = req.nextUrl.searchParams.get("src");
  if (!src) {
    return NextResponse.json({ detail: "src is required" }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(src);
  } catch {
    return NextResponse.json({ detail: "Invalid src" }, { status: 400 });
  }

  if (!ALLOWED_HOSTS.has(target.hostname)) {
    return NextResponse.json({ detail: "Host not allowed" }, { status: 400 });
  }

  const range = req.headers.get("range");

  // Proxy the request server-side so the browser fetches audio same-origin,
  // avoiding CORS restrictions on the backend media host (and allowing seeking via Range).
  const upstream = await fetch(target.toString(), {
    headers: range ? { range } : undefined,
    cache: "no-store",
  });

  if (!upstream.ok && upstream.status !== 206) {
    return NextResponse.json(
      { detail: "Failed to fetch audio" },
      { status: upstream.status },
    );
  }

  const headers = new Headers();
  for (const h of [
    "content-type",
    "content-length",
    "content-range",
    "accept-ranges",
  ]) {
    const v = upstream.headers.get(h);
    if (v) headers.set(h, v);
  }
  if (!headers.has("accept-ranges")) headers.set("accept-ranges", "bytes");
  headers.set("cache-control", "public, max-age=3600");

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers,
  });
}
