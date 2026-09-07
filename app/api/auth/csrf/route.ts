
import { NextRequest, NextResponse } from "next/server";

import { backend } from "@/utils/getURL";
import { forwardSetCookie } from "@/utils/forwardSetCookie";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${backend}/api/auth/csrf/`, {
      method: "GET",
      headers: {
        Cookie: req.headers.get("cookie") ?? "",
      },
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    const response = NextResponse.json(
      data ?? { success: res.ok },
      {
        status: res.status,
      },
    );

    forwardSetCookie(res, response);

    return response;
  } catch {
    return NextResponse.json(
      {
        detail: "دریافت CSRF token ناموفق بود",
      },
      {
        status: 500,
      },
    );
  }
}

