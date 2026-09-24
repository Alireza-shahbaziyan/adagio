import { forwardSetCookie } from "@/utils/forwardSetCookie";
import { backend } from "@/utils/getURL";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const csrfToken = req.cookies.get("csrftoken")?.value;

    const res = await fetch(`${backend}/api/auth/addresses/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.get("cookie") ?? "",
        ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
      },
      body,
      cache: "no-store",
    });

    const rawData = await res.json();
    console.log("-----rawData POST:", rawData);
    let data: unknown = null;
    try {
      data = rawData;
    } catch {
      if (!res.ok) {
        console.error(
          "addresses POST — non-JSON error body from backend:",
          JSON.stringify(rawData).replace(/<style>[\s\S]*?<\/style>/, "").slice(0, 4000),
        );
      }
    }

    if (!res.ok) {
      return NextResponse.json(data ?? { detail: "ثبت آدرس ناموفق بود" }, {
        status: res.status,
      });
    }

    const response = NextResponse.json(data, { status: 201 });
    forwardSetCookie(res, response, req);
    return response;
  } catch {
    return NextResponse.json(
      { detail: "Internal Server Error | Error creating address" },
      { status: 500 },
    );
  }
}
