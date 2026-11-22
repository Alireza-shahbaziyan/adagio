import { backend } from "@/utils/getURL";
import { buildProxyHeaders } from "@/lib/backend-client";
import { forwardSetCookie } from "@/utils/forwardSetCookie";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phone = body?.phone;

    if (!phone) {
      return NextResponse.json(
        { detail: "Phone is required" },
        { status: 400 },
      );
    }

    const proxy = await buildProxyHeaders(req, {
      "Content-Type": "application/json",
    });

    if (!proxy.ok) return proxy.response;

    const res = await fetch(`${backend}/api/auth/login/`, {
      method: "POST",
      headers: proxy.headers,
      body: JSON.stringify({
        phone: phone.replace(/^0/, ""),
      }),
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    const response = NextResponse.json(data, {
      status: res.status,
    });

    if (proxy.csrfResponse) forwardSetCookie(proxy.csrfResponse, response);
    forwardSetCookie(res, response);

    return response;
  } catch {
    return NextResponse.json(
      { detail: "Internal Server Error" },
      { status: 500 },
    );
  }
}
