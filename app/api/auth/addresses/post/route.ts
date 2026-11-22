import { forwardSetCookie } from "@/utils/forwardSetCookie";
import { backend } from "@/utils/getURL";
import { buildProxyHeaders } from "@/lib/backend-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const proxy = await buildProxyHeaders(req, {
      "Content-Type": "application/json",
    });

    if (!proxy.ok) return proxy.response;

    const res = await fetch(`${backend}/api/auth/addresses/`, {
      method: "POST",
      headers: proxy.headers,
      body,
      cache: "no-store",
    });

    const rawData = await res.json();
    console.log("-----rawData POST:", rawData);
    let data: unknown = null;
    try {
      data = rawData;
    } catch {
      if (!res.ok) {
        console.error(
          "addresses POST — non-JSON error body from backend:",
          JSON.stringify(rawData).replace(/<style>[\s\S]*?<\/style>/, "").slice(0, 4000),
        );
      }
    }

    if (!res.ok) {
      return NextResponse.json(data ?? { detail: "ثبت آدرس ناموفق بود" }, {
        status: res.status,
      });
    }

    const response = NextResponse.json(data, { status: 201 });
    if (proxy.csrfResponse) forwardSetCookie(proxy.csrfResponse, response);
    forwardSetCookie(res, response);
    return response;
  } catch {
    return NextResponse.json(
      { detail: "Internal Server Error | Error creating address" },
      { status: 500 },
    );
  }
}
