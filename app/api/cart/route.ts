import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/utils/getURL";
import { forwardSetCookie } from "@/utils/forwardSetCookie";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${backend}/api/cart/`, {
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") ?? "",
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        data ?? { detail: "درخواست سبد خرید ناموفق بود" },
        { status: res.status },
      );
    }

    const response = NextResponse.json(data, { status: 200 });
    forwardSetCookie(res, response);
    return response;
  } catch {
    return NextResponse.json(
      { detail: "Internal Server Error | Error in get cart" },
      { status: 500 },
    );
  }
}
