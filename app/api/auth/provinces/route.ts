import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/utils/getURL";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${backend}/api/auth/provinces/`, {
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") ?? "",
      },
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        data ?? { detail: "دریافت لیست استان‌ها ناموفق بود" },
        { status: res.status },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      { detail: "Internal Server Error | Error in get provinces" },
      { status: 500 },
    );
  }
}
