import { NextRequest, NextResponse } from "next/server";

const backend = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phone = body?.phone;

    if (!phone) {
      return NextResponse.json(
        { detail: "Phone is required" },
        { status: 400 }
      );
    }

    const res = await fetch(`${backend}/api/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: phone.replace(/^0/, ""),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, {
        status: res.status,
      });
    }

    return NextResponse.json(data, {
      status: 200,
    });
  } catch (err) {
    console.error("Login route error:", err);

    return NextResponse.json(
      { detail: "Internal Server Error" },
      { status: 500 }
    );
  }
}