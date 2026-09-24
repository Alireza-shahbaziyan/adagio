import { backend } from "@/utils/getURL";
import { forwardSetCookie } from "@/utils/forwardSetCookie";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${backend}/api/auth/me/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.get("cookie") ?? "",
      },
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    const nextResponse = NextResponse.json(data, {
      status: res.status,
    });

    forwardSetCookie(res, nextResponse, req);

    return nextResponse;
  } catch {
    return NextResponse.json(
      { detail: "Internal Server Error" },
      { status: 500 },
    );
  }
}
