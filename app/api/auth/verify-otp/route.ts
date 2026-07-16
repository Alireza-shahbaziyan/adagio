import { backend } from "@/utils/getURL";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest) {
  try {
    const { phone, code } = await req.json();
     const formattedPhone = phone.replace(/^0/, "");
     
    const res = await fetch(`${backend}/api/auth/verify/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: formattedPhone, code }),
    });

    const rawText = await res.text();
    let data: unknown;
    try {
      data = JSON.parse(rawText);
    } catch {
      console.error("verify-otp: backend returned non-JSON response", {
        status: res.status,
        bodyPreview: rawText.slice(0, 300),
      });
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
    const setCookie = res.headers.get("set-cookie");
    const response = NextResponse.json(data, {
      status: 200,
    });

    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }

    return response
  } catch (error) {
    console.log('----',error);
    return NextResponse.json(
      { detail: "Internal Server Error | Error in send verify OTP" },
      { status: 500 }
    );
  }
}
