import { NextRequest, NextResponse } from "next/server";

import { backendFetch } from "@/lib/backend-client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { phone, code } = await req.json();

    const formattedPhone = phone.replace(/^0/, "");

    return backendFetch(
      req,
      "/api/auth/verify/",
      {
        method: "POST",
        body: {
          phone: formattedPhone,
          code,
        },
      },
    );
  } catch {
    return NextResponse.json(
      {
        detail:
          "Internal Server Error | Error in send verify OTP",
      },
      { status: 500 },
    );
  }
}