import { NextRequest, NextResponse } from "next/server";
import { forwardSetCookie } from "@/utils/forwardSetCookie";
import { backend, frontend, referer } from "@/utils/getURL";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;
    const body = await req.json();

    if (
      typeof body !== "object" ||
      body === null ||
      typeof body.gateway_id !== "number" ||
      body.gateway_id <= 0
    ) {
      return NextResponse.json(
        { detail: "درگاه پرداخت نامعتبر است" },
        { status: 400 },
      );
    }

    const csrfToken = req.cookies.get("csrftoken")?.value;
    const res = await fetch(`${backend}/api/orders/${token}/pay/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") ?? "",
        Referer: referer ?? frontend ?? "",
        ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
      },
      body: JSON.stringify({ gateway_id: body.gateway_id }),
      cache: "no-store",
    });

    const data = await res.text();

    let parsed: unknown;
    let isJson = false;

    if (data) {
      try {
        parsed = JSON.parse(data);
        isJson = true;
      } catch {
        // Keep the raw body below if the backend did not return JSON.
      }
    }

    if (!res.ok) {
      if (isJson) {
        return NextResponse.json(parsed, { status: res.status });
      }

      return new NextResponse(data || null, {
        status: res.status,
        headers: {
          "Content-Type":
            res.headers.get("content-type") ?? "text/plain; charset=utf-8",
        },
      });
    }

    const response = isJson
      ? NextResponse.json(parsed, { status: 200 })
      : new NextResponse(data || null, {
          status: 200,
          headers: {
            "Content-Type":
              res.headers.get("content-type") ?? "text/plain; charset=utf-8",
          },
        });

    forwardSetCookie(res, response);

    return response;
    
  } catch {
    return NextResponse.json(
      { detail: "Internal Server Error | Error initiating payment" },
      { status: 500 },
    );
  }
}
