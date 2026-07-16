import { backend } from "@/utils/getURL";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const response = await fetch(`${backend}/api/auth/me/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") ?? "",
      },
      cache: "no-store",
    });

    const rawText = await response.text();
    let data: unknown;
    try {
      data = JSON.parse(rawText);
    } catch {
      data = { detail: "Unauthorized" };
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.log("---", error);
    return NextResponse.json(
      { detail: "Internal Server Error" },
      { status: 500 },
    );
  }
}