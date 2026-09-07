import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/utils/getURL";
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

    const csrfToken = req.cookies.get("csrftoken")?.value;
    const res = await fetch(`${backend}/api/orders/${token}/address/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") ?? "",
        ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
      },
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
    forwardSetCookie(res, response);
    return response;
  } catch {
    return NextResponse.json(
      { detail: "Internal Server Error | Error updating order address" },
      { status: 500 },
    );
  }
}
