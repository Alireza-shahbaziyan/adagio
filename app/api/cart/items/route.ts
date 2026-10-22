import { NextRequest } from "next/server";

import { backendFetch } from "@/lib/backend-client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
     return backendFetch(req, "/api/cart/", {
        method: "POST",
        body,
      });
  // try {
  //   const body = await req.text();
  //   const csrfToken = req.cookies.get("csrftoken")?.value;
  //   const res = await fetch(`${backend}/api/cart/items/`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       cookie: req.headers.get("cookie") ?? "",
  //       ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
  //     },
  //     body,
  //     cache: "no-store",
  //   });

  //   const data = await res.json().catch(() => null);

  //   if (!res.ok) {
  //     return NextResponse.json(
  //       data ?? { detail: "درخواست سبد خرید ناموفق بود" },
  //       { status: res.status },
  //     );
  //   }

  //   const response = NextResponse.json(data, { status: 200 });
  //   forwardSetCookie(res, response);
  //   return response;
  // } catch {
  //   return NextResponse.json(
  //     { detail: "Internal Server Error | Error adding cart item" },
  //     { status: 500 },
  //   );
  // }
}
