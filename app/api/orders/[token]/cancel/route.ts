import { NextRequest, NextResponse } from "next/server";

import { backendFetch } from "@/lib/backend-client";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;

    return backendFetch(
      req,
      `/api/orders/${token}/cancel/`,
      {
        method: "POST",
      },
    );
  } catch {
    return NextResponse.json(
      {
        detail:
          "Internal Server Error | Error cancelling order",
      },
      { status: 500 },
    );
  }
}