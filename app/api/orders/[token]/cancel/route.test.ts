import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

import { POST } from "@/app/api/orders/[token]/cancel/route";

function cancelRequest(cookie: string) {
  return new NextRequest("http://localhost:3030/api/orders/token-1/cancel", {
    method: "POST",
    headers: { cookie },
  });
}

const routeContext = {
  params: Promise.resolve({ token: "token-1" }),
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("POST /api/orders/[token]/cancel", () => {
  it("sends a valid CSRF token with cookies and Referer", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: 1, status: "canceled" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      cancelRequest("sessionid=test-session; csrftoken=test-csrf"),
      routeContext,
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(String(url)).toContain("/api/orders/token-1/cancel/");

    const headers = new Headers(init.headers);
    expect(headers.get("X-CSRFToken")).toBe("test-csrf");
    expect(headers.get("Cookie")).toContain("sessionid=test-session");
    expect(headers.get("Referer")).not.toBeNull();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      id: 1,
      status: "canceled",
    });
  });

  it("initializes the CSRF token instead of skipping the header", async () => {
    const fetchMock = vi
      .fn()
      .mockImplementation(async (url: string | URL | Request) => {
        if (String(url).includes("/api/auth/csrf/")) {
          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "set-cookie": "csrftoken=fresh-csrf; Path=/",
            },
          });
        }

        return new Response(JSON.stringify({ id: 1, status: "canceled" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      });
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      cancelRequest("sessionid=test-session"),
      routeContext,
    );

    // One CSRF bootstrap call plus the actual cancellation call.
    expect(fetchMock).toHaveBeenCalledTimes(2);

    const [cancelUrl, cancelInit] = fetchMock.mock.calls[1] as [
      string,
      RequestInit,
    ];
    expect(String(cancelUrl)).toContain("/api/orders/token-1/cancel/");

    const headers = new Headers(cancelInit.headers);
    expect(headers.get("X-CSRFToken")).toBe("fresh-csrf");
    expect(headers.get("Cookie")).toContain("csrftoken=fresh-csrf");

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      id: 1,
      status: "canceled",
    });
  });

  it("keeps the fallback detail when the backend fails without a body", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 400 }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      cancelRequest("sessionid=test-session; csrftoken=test-csrf"),
      routeContext,
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      detail: "لغو سفارش ناموفق بود",
    });
  });
});
