import { NextRequest } from "next/server";
import { backendFetch } from "@/lib/backend-client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  return backendFetch(req, "/api/auth/logout/", {
    method: "POST",
  });
}
