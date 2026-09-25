import { NextRequest, NextResponse } from "next/server";

import { backendFetch } from "@/lib/backend-client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    return backendFetch(
      req,
      "/api/auth/logout/",
      {
        method: "POST",
      },
    );
  } catch {
    return NextResponse.json(
      { detail: "Internal Server Error" },
      { status: 500 },
    );
  }
}