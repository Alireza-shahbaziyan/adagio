import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/utils/getURL";
import { forwardSetCookie } from "@/utils/forwardSetCookie";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${backend}/api/auth/addresses/`, {
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") ?? "",
      },
      cache: "no-store",
    });

    const rawText = await res.text();
    let data: unknown = null;
    try {
      data = JSON.parse(rawText);
    } catch {
      if (!res.ok) {
        console.error(
          "addresses GET — non-JSON error body from backend:",
          rawText.replace(/<style>[\s\S]*?<\/style>/, "").slice(0, 4000),
        );
      }
    }

    if (!res.ok) {
      return NextResponse.json(
        data ?? { detail: "دریافت آدرس‌ها ناموفق بود" },
        { status: res.status },
      );
    }

    const response = NextResponse.json(data, { status: 200 });
    forwardSetCookie(res, response);
    return response;
  } catch {
    return NextResponse.json(
      { detail: "Internal Server Error | Error in get addresses" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const csrfToken = req.cookies.get("csrftoken")?.value;

    const res = await fetch(`${backend}/api/auth/addresses/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") ?? "",
        ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
      },
      body,
      cache: "no-store",
    });

    const rawText = await res.text();
    let data: unknown = null;
    try {
      data = JSON.parse(rawText);
    } catch {
      if (!res.ok) {
        console.error(
          "addresses POST — non-JSON error body from backend:",
          rawText.replace(/<style>[\s\S]*?<\/style>/, "").slice(0, 4000),
        );
      }
    }

    if (!res.ok) {
      return NextResponse.json(data ?? { detail: "ثبت آدرس ناموفق بود" }, {
        status: res.status,
      });
    }

    const response = NextResponse.json(data, { status: 201 });
    forwardSetCookie(res, response);
    return response;
  } catch {
    return NextResponse.json(
      { detail: "Internal Server Error | Error creating address" },
      { status: 500 },
    );
  }
}
