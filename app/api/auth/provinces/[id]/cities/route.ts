import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/utils/getURL";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const res = await fetch(`${backend}/api/auth/provinces/${id}/cities/`, {
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") ?? "",
      },
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        data ?? { detail: "دریافت لیست شهرها ناموفق بود" },
        { status: res.status },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      { detail: "Internal Server Error | Error in get cities" },
      { status: 500 },
    );
  }
}
