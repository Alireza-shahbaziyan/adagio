import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/utils/getURL";
import { buildProxyHeaders } from "@/lib/backend-client";
import { forwardSetCookie } from "@/utils/forwardSetCookie";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;
    const body = await req.json();

    if (
      typeof body !== "object" ||
      body === null ||
      typeof body.address_id !== "number" ||
      body.address_id <= 0
    ) {
      return NextResponse.json(
        { detail: "آدرس نامعتبر است" },
        { status: 400 },
      );
    }

    const proxy = await buildProxyHeaders(req, {
      "Content-Type": "application/json",
    });

    if (!proxy.ok) return proxy.response;

    const res = await fetch(`${backend}/api/orders/${token}/address/`, {
      method: "PATCH",
      headers: proxy.headers,
      body: JSON.stringify({ address_id: body.address_id }),
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        data ?? { detail: "بروزرسانی آدرس ناموفق بود" },
        { status: res.status },
      );
    }

    const response = NextResponse.json(data, { status: 200 });
    if (proxy.csrfResponse) forwardSetCookie(proxy.csrfResponse, response);
    forwardSetCookie(res, response);
    return response;
  } catch {
    return NextResponse.json(
      { detail: "Internal Server Error | Error updating order address" },
      { status: 500 },
    );
  }
}
