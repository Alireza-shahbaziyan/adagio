import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/utils/getURL";
import { buildProxyHeaders } from "@/lib/backend-client";
import { forwardSetCookie } from "@/utils/forwardSetCookie";

export const dynamic = "force-dynamic";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  try {
    const proxy = await buildProxyHeaders(req, {
      "Content-Type": "application/json",
    });

    if (!proxy.ok) return proxy.response;

    const res = await fetch(`${backend}/api/wishlist/items/${slug}/`, {
      method: "DELETE",
      headers: proxy.headers,
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        data ?? { detail: "حذف از علاقه‌مندی‌ها ناموفق بود" },
        { status: res.status },
      );
    }

    const response = NextResponse.json(data, { status: 200 });
    if (proxy.csrfResponse) forwardSetCookie(proxy.csrfResponse, response);
    forwardSetCookie(res, response);
    return response;
  } catch {
    return NextResponse.json(
      { detail: "Internal Server Error | Error removing wishlist item" },
      { status: 500 },
    );
  }
}
