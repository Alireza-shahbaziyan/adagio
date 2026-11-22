import { NextRequest } from "next/server";
import { backendFetch } from "@/lib/backend-client";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  return backendFetch(req, `/api/orders/${token}/cancel/`, {
    method: "POST",
    fallbackDetail: "لغو سفارش ناموفق بود",
  });
}
