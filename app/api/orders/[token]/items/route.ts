import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/utils/getURL";
import { buildProxyHeaders } from "@/lib/backend-client";
import { forwardSetCookie } from "@/utils/forwardSetCookie";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;
    const body = await req.json();

    if (
      typeof body !== "object" ||
      body === null ||
      typeof body.sku !== "string" ||
      typeof body.quantity !== "number" ||
      body.quantity < 1
    ) {
      return NextResponse.json(
        { detail: "اطلاعات آیتم نامعتبر است" },
        { status: 400 },
      );
    }

    const proxy = await buildProxyHeaders(req, {
      "Content-Type": "application/json",
    });

    if (!proxy.ok) return proxy.response;

    const res = await fetch(`${backend}/api/orders/${token}/items/`, {
      method: "POST",
      headers: proxy.headers,
      body: JSON.stringify({ sku: body.sku, quantity: body.quantity }),
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        data ?? { detail: "افزودن آیتم ناموفق بود" },
        { status: res.status },
      );
    }

    const response = NextResponse.json(data, { status: 201 });
    if (proxy.csrfResponse) forwardSetCookie(proxy.csrfResponse, response);
    forwardSetCookie(res, response);
    return response;
  } catch {
    return NextResponse.json(
      { detail: "Internal Server Error | Error adding order item" },
      { status: 500 },
    );
  }
}
