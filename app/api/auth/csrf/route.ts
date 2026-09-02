import { backend } from "@/utils/getURL";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(`${backend}/api/auth/csrf/`, {
      method: "GET",
      headers:{
              "Content-Type": "application/json",
              
      },
      cache: "no-store",
    });

    const nextResponse = new NextResponse(null, {
      status: response.status,
    });

    const setCookie = response.headers.get("set-cookie");

    if (setCookie) {
      nextResponse.headers.set("set-cookie", setCookie);
    }

    return nextResponse;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { detail: "Internal Server Error" },
      { status: 500 },
    );
  }
}