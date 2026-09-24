import { backend } from "@/utils/getURL";
import { forwardSetCookie } from "@/utils/forwardSetCookie";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const csrfToken = req.cookies.get("csrftoken")?.value;

    const res = await fetch(`${backend}/api/auth/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.get("cookie") ?? "",
        ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
      },
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    const response = NextResponse.json(data, {
      status: res.status,
    });

    forwardSetCookie(res, response, req);

    return response;
  } catch {
    return NextResponse.json(
      { detail: "Internal Server Error" },
      { status: 500 },
    );
  }
}
