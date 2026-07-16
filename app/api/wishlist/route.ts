import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/utils/getURL";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${backend}/api/wishlist/`, {
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") ?? "",
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        data ?? { detail: "درخواست علاقه‌مندی‌ها ناموفق بود" },
        { status: res.status },
      );
    }
    
    const response = NextResponse.json(data, { status: 200 });
    const setCookie = res.headers.get("set-cookie");
    if (setCookie) response.headers.set("set-cookie", setCookie);

    return response;
  } catch {
    return NextResponse.json(
      { detail: "Internal Server Error | Error in get wishlist" },
      { status: 500 },
    );
  }
}
