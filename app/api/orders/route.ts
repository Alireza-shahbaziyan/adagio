import { NextRequest } from "next/server";
import { backendFetch } from "@/lib/backend-client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json();
  
  console.log("---- this is /app/api/Order/route.ts -- POST --  ");
  console.log("--- body:",body);
  
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
