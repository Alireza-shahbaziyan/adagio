import { backend } from "@/utils/getURL";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cookie = req.headers.get("cookie");
    const response = await fetch(`${backend}/api/auth/me/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: cookie || "",
      },
      cache: "no-store",
    });

    const data = await response.json();
    console.log(data);

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
