
import { NextRequest } from "next/server";
import { backendFetch } from "@/lib/backend-client";
import { backend } from "@/utils/getURL";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json();

  return backendFetch(req, "/api/orders/", {
    method: "POST",
    body,
  });
}

export async function GET(req: NextRequest) {
const path = `/api/orders/${req.nextUrl.search}`;
  return backendFetch(req, path.toString(), {
    method: "GET",
  });
}
