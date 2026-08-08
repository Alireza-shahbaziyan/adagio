import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/utils/getURL";
import { forwardSetCookie } from "@/utils/forwardSetCookie";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const body = await req.text();
    const csrfToken = req.cookies.get("csrftoken")?.value;
    const res = await fetch(`${backend}/api/auth/addresses/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") ?? "",
        ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
      },
      body,
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(data ?? { detail: "ویرایش آدرس ناموفق بود" }, {
        status: res.status,
      });
    }

    const response = NextResponse.json(data, { status: 200 });
    forwardSetCookie(res, response);
    return response;
  } catch {
    return NextResponse.json(
      { detail: "Internal Server Error | Error updating address" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const csrfToken = req.cookies.get("csrftoken")?.value;
    const res = await fetch(`${backend}/api/auth/addresses/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") ?? "",
        ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
      },
      cache: "no-store",
    });

    const setCookie = res.headers.getSetCookie?.() ?? [];

    if (res.status === 204) {
      const response = new NextResponse(null, { status: 204 });
      for (const c of setCookie) response.headers.append("set-cookie", c);
      return response;
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(data ?? { detail: "حذف آدرس ناموفق بود" }, {
        status: res.status,
      });
    }

    const response = NextResponse.json(data, { status: 200 });
    for (const c of setCookie) response.headers.append("set-cookie", c);
    return response;
  } catch {
    return NextResponse.json(
      { detail: "Internal Server Error | Error deleting address" },
      { status: 500 },
    );
  }
}
