import { backend } from "@/utils/getURL";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cookie = req.headers.get("cookie");
    const response = await fetch(`${backend}/api/auth/me/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookie || "",
      },
      
      cache: "no-store",
    });

    const data = await response.json();
    
    const nextResponse = NextResponse.json(data, {
      status: response.status,
    });
    return nextResponse;

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { detail: "Internal Server Error" },
      { status: 500 },
    );
  }
}
