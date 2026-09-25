import { NextRequest, NextResponse } from "next/server";

import { backendFetch } from "@/lib/backend-client";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;
    const body = await req.json();

    if (
      typeof body !== "object" ||
      body === null ||
      typeof body.address_id !== "number" ||
      body.address_id <= 0
    ) {
      return NextResponse.json(
        { detail: "آدرس نامعتبر است" },
        { status: 400 },
      );
    }

    return backendFetch(
      req,
      `/api/orders/${token}/address/`,
      {
        method: "PATCH",
        body: {
          address_id: body.address_id,
        },
      },
    );
  } catch {
    return NextResponse.json(
      {
        detail:
          "Internal Server Error | Error updating order address",
      },
      { status: 500 },
    );
  }
}