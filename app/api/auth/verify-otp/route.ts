import { NextRequest, NextResponse } from "next/server";

const backend = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function POST(req: NextRequest) {
  try {
    const { phone, code } = await req.json();
     const formattedPhone = phone.replace(/^0/, "");
    const res = await fetch(`${backend}/api/auth/verify/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ phone: formattedPhone, code }),
    });
    const data = await res.json();
    // check Django status
    if (!res.ok) {
      return NextResponse.json(data, {
        status: res.status,
      });
    }
    const setCookie = res.headers.get("set-cookie");
    const response = NextResponse.json(data, {
      status: 200,
    });
    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }
    return response
  } catch {
    return NextResponse.json(
      { detail: "Internal Server Error | Error in send verify OTP" },
      { status: 500 }
    );
  }
}
