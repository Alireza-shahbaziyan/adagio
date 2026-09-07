
import { NextRequest } from "next/server";
import { backendFetch } from "@/lib/backend-client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json();

  return backendFetch(req, "/api/orders/", {
    method: "POST",
    body,
  });
}

export async function GET(req: NextRequest) {
  return backendFetch(req, "/api/orders/", {
    method: "GET",
  });
}
