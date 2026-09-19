import { backend } from "@/utils/getURL";
import { forwardSetCookie } from "@/utils/forwardSetCookie";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { phone, code } = await req.json();
    const formattedPhone = phone.replace(/^0/, "");

    const csrfToken = req.cookies.get("csrftoken")?.value;

    const res = await fetch(`${backend}/api/auth/verify/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.get("cookie") ?? "",
        ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
      },
      body: JSON.stringify({ phone: formattedPhone, code }),
      cache: "no-store",
    });

    const rawText = await res.text();
    let data: unknown;
    try {
      data = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        { detail: "سرور با خطا مواجه شد. لطفاً بعداً دوباره تلاش کن." },
        { status: 502 },
      );
    }

    if (!res.ok) {
      return NextResponse.json(data, {
        status: res.status,
      });
    }

    const response = NextResponse.json(data, {
      status: 200,
    });

    forwardSetCookie(res, response);

    return response;
  } catch {
    return NextResponse.json(
      { detail: "Internal Server Error | Error in send verify OTP" },
      { status: 500 },
    );
  }
}
