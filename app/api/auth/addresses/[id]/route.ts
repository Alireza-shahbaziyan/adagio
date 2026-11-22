import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/utils/getURL";
import { buildProxyHeaders } from "@/lib/backend-client";
import { forwardSetCookie } from "@/utils/forwardSetCookie";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const body = await req.text();
    const proxy = await buildProxyHeaders(req, {
      "Content-Type": "application/json",
    });

    if (!proxy.ok) return proxy.response;

    const res = await fetch(`${backend}/api/auth/addresses/${id}/`, {
      method: "PUT",
      headers: proxy.headers,
      body,
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(data ?? { detail: "ویرایش آدرس ناموفق بود" }, {
        status: res.status,
      });
    }

    const response = NextResponse.json(data, { status: 200 });
    if (proxy.csrfResponse) forwardSetCookie(proxy.csrfResponse, response);
    forwardSetCookie(res, response);
    return response;
  } catch {
    return NextResponse.json(
      { detail: "Internal Server Error | Error updating address" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const proxy = await buildProxyHeaders(req, {
      "Content-Type": "application/json",
    });

    if (!proxy.ok) return proxy.response;

    const res = await fetch(`${backend}/api/auth/addresses/${id}/`, {
      method: "DELETE",
      headers: proxy.headers,
      cache: "no-store",
    });

    if (res.status === 204) {
      const response = new NextResponse(null, { status: 204 });
      if (proxy.csrfResponse) forwardSetCookie(proxy.csrfResponse, response);
      forwardSetCookie(res, response);
      return response;
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(data ?? { detail: "حذف آدرس ناموفق بود" }, {
        status: res.status,
      });
    }

    const response = NextResponse.json(data, { status: 200 });
    if (proxy.csrfResponse) forwardSetCookie(proxy.csrfResponse, response);
    forwardSetCookie(res, response);
    return response;
  } catch {
    return NextResponse.json(
      { detail: "Internal Server Error | Error deleting address" },
      { status: 500 },
    );
  }
}
