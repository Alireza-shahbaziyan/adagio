import { afterEach, describe, expect, it, vi } from "vitest";

import { apiRequest, ApiClientError } from "@/lib/api-client";

function mockJsonResponse(body: unknown, status: number) {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );

  vi.stubGlobal("fetch", fetchMock);

  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("apiRequest error normalization", () => {
  it("preserves the backend status and detail message", async () => {
    mockJsonResponse(
      { detail: "This order is no longer payable (already paid or expired)." },
      400,
    );

    await expect(apiRequest("/api/orders/token/pay")).rejects.toMatchObject({
      name: "ApiClientError",
      status: 400,
      message: "This order is no longer payable (already paid or expired).",
    });
  });

  it("joins DRF detail lists instead of hiding them", async () => {
    mockJsonResponse({ detail: ["First problem.", "Second problem."] }, 400);

    await expect(apiRequest("/api/orders/token/pay")).rejects.toMatchObject({
      status: 400,
      message: "First problem. Second problem.",
    });
  });

  it("surfaces the first field error when there is no detail", async () => {
    mockJsonResponse(
      { gateway_id: ["The selected payment gateway is not valid."] },
      400,
    );

    try {
      await apiRequest("/api/orders/token/pay");
      expect.unreachable("apiRequest should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(ApiClientError);

      const apiError = error as ApiClientError;
      expect(apiError.status).toBe(400);
      expect(apiError.message).toBe(
        "The selected payment gateway is not valid.",
      );
      expect(apiError.fieldErrors).toEqual({
        gateway_id: ["The selected payment gateway is not valid."],
      });
    }
  });
});
