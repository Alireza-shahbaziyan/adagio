import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/utils/getURL";
import { forwardSetCookie } from "@/utils/forwardSetCookie";
import { backendFetch } from "@/lib/backend-client";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const body = await req.json();

  return backendFetch(req, `/api/orders/${token}/pay/`, {
    method: "POST",
    body,
  });
}
