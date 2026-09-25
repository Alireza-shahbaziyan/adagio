import { NextRequest, NextResponse } from "next/server";

import { backendFetch } from "@/lib/backend-client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    return backendFetch(
      req,
      "/api/auth/addresses/",
      {
        method: "POST",
        body,
      },
    );
  } catch {
    return NextResponse.json(
      {
        detail:
          "Internal Server Error | Error creating address",
      },
      { status: 500 },
    );
  }
}