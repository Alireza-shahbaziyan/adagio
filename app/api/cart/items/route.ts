import { NextRequest, NextResponse } from "next/server";

import { backendFetch } from "@/lib/backend-client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    return backendFetch(
      req,
      "/api/cart/items/",
      {
        method: "POST",
        body,
      },
    );
  } catch {
    return NextResponse.json(
      {
        detail:
          "Internal Server Error | Error adding cart item",
      },
      { status: 500 },
    );
  }
}