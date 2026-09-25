import { NextRequest, NextResponse } from "next/server";

import { backendFetch } from "@/lib/backend-client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phone = body?.phone;

    if (!phone) {
      return NextResponse.json(
        { detail: "Phone is required" },
        { status: 400 },
      );
    }

    return backendFetch(
      req,
      "/api/auth/login/",
      {
        method: "POST",
        body: {
          phone: phone.replace(/^0/, ""),
        },
      },
    );
  } catch {
    return NextResponse.json(
      { detail: "Internal Server Error" },
      { status: 500 },
    );
  }
}