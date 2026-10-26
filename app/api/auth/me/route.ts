
import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend-client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  return backendFetch(
      req,
      `/api/auth/me/`,
      {
        method: "GET",
      },
    );
}

export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { detail: "داده‌های پروفایل معتبر نیست" },
      { status: 400 },
    );
  }

  return backendFetch(req, "/api/auth/me/", {
    method: "PATCH",
    body,
  });
}
