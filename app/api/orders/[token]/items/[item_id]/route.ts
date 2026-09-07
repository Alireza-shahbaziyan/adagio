import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/utils/getURL";
import { forwardSetCookie } from "@/utils/forwardSetCookie";

export const dynamic = "force-dynamic";

async function proxyOrderItemRequest(
  req: NextRequest,
  token: string,
  itemId: string,
  method: "PATCH" | "DELETE",
) {
  try {
    const body = method === "PATCH" ? await req.text() : undefined;
    const csrfToken = req.cookies.get("csrftoken")?.value;
    const res = await fetch(
      `${backend}/api/orders/${token}/items/${itemId}/`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
          cookie: req.headers.get("cookie") ?? "",
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
        },
        body,
        cache: "no-store",
      },
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        data ?? { detail: "درخواست آیتم سفارش ناموفق بود" },
        { status: res.status },
      );
    }

    const response = NextResponse.json(data, { status: 200 });
    forwardSetCookie(res, response);
    return response;
  } catch {
    return NextResponse.json(
      { detail: "Internal Server Error | Error updating order item" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: { params: Promise<{ token: string; item_id: string }> },
) {
  const { token, item_id } = await params;
  return proxyOrderItemRequest(req, token, item_id, "PATCH");
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: { params: Promise<{ token: string; item_id: string }> },
) {
  const { token, item_id } = await params;
  return proxyOrderItemRequest(req, token, item_id, "DELETE");
}
