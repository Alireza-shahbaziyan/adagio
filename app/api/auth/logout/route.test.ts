import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

import { POST } from "@/app/api/auth/logout/route";

function logoutRequest(cookie: string) {
  return new NextRequest("http://localhost:3030/api/auth/logout", {
    method: "POST",
    headers: { cookie },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("POST /api/auth/logout", () => {
  it("sends a valid CSRF token with cookies and Referer", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "set-cookie": "sessionid=; Max-Age=0; Path=/",
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      logoutRequest("sessionid=test-session; csrftoken=test-csrf"),
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(String(url)).toContain("/api/auth/logout/");

    const headers = new Headers(init.headers);
    expect(headers.get("X-CSRFToken")).toBe("test-csrf");
    expect(headers.get("Cookie")).toContain("sessionid=test-session");
    expect(headers.get("Referer")).not.toBeNull();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
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

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      });
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(logoutRequest("sessionid=test-session"));

    // One CSRF bootstrap call plus the actual logout call.
    expect(fetchMock).toHaveBeenCalledTimes(2);

    const [logoutUrl, logoutInit] = fetchMock.mock.calls[1] as [
      string,
      RequestInit,
    ];
    expect(String(logoutUrl)).toContain("/api/auth/logout/");

    const headers = new Headers(logoutInit.headers);
    expect(headers.get("X-CSRFToken")).toBe("fresh-csrf");
    expect(headers.get("Cookie")).toContain("csrftoken=fresh-csrf");

    expect(response.status).toBe(200);
    // The freshly issued CSRF cookie is forwarded to the browser.
    expect(response.headers.getSetCookie().join(";")).toContain(
      "csrftoken=fresh-csrf",
    );
  });

  it("preserves the backend status and body", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ detail: "Not authenticated." }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      logoutRequest("sessionid=test-session; csrftoken=test-csrf"),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      detail: "Not authenticated.",
    });
  });
});
