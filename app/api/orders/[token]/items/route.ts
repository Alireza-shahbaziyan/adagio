import { NextRequest, NextResponse } from "next/server";

import { backendFetch } from "@/lib/backend-client";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;
    const body = await req.json();

    if (
      typeof body !== "object" ||
      body === null ||
      typeof body.sku !== "string" ||
      typeof body.quantity !== "number" ||
      body.quantity < 1
    ) {
      return NextResponse.json(
        { detail: "اطلاعات آیتم نامعتبر است" },
        { status: 400 },
      );
    }

    return backendFetch(
      req,
      `/api/orders/${token}/items/`,
      {
        method: "POST",
        body: {
          sku: body.sku,
          quantity: body.quantity,
        },
      },
    );
  } catch {
    return NextResponse.json(
      { detail: "Internal Server Error | Error adding order item" },
      { status: 500 },
    );
  }
}