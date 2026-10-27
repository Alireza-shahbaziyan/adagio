import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

import { POST } from "@/app/api/orders/[token]/pay/route";

function paymentRequest(body: unknown) {
  return new NextRequest("http://localhost:3030/api/orders/token-1/pay", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: "sessionid=test-session; csrftoken=test-csrf",
    },
    body: JSON.stringify(body),
  });
}

const routeContext = {
  params: Promise.resolve({ token: "token-1" }),
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("POST /api/orders/[token]/pay", () => {
  it("forwards only gateway_id and preserves the backend 400 body/status", async () => {
    const body = {
      detail: "This order is no longer payable (already paid or expired).",
    };
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(body), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      paymentRequest({ gateway_id: 3, amount: 999, extra: "ignored" }),
      routeContext,
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(String(init.body))).toEqual({ gateway_id: 3 });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual(body);
  });

  it("preserves a non-JSON backend error body", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response("upstream exploded", {
        status: 502,
        headers: { "Content-Type": "text/plain" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(paymentRequest({ gateway_id: 3 }), routeContext);

    expect(response.status).toBe(502);
    await expect(response.text()).resolves.toBe("upstream exploded");
    expect(response.headers.get("content-type")).toContain("text/plain");
  });

  it("rejects an invalid gateway id without calling the backend", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(paymentRequest({ gateway_id: 0 }), routeContext);

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
