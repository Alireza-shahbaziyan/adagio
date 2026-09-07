
import type { ApiError } from "@/types/checkout";

export class ApiClientError extends Error {
  status: number;
  code?: string;
  fieldErrors?: Record<string, string[]>;

  constructor(err: ApiError) {
    super(err.message);
    this.name = "ApiClientError";
    this.status = err.status;
    this.code = err.code;
    this.fieldErrors = err.fieldErrors;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeError(status: number, data: unknown): ApiError {
  if (isRecord(data)) {
    const message =
      typeof data.detail === "string"
        ? data.detail
        : typeof data.message === "string"
          ? data.message
          : "درخواست ناموفق بود";

    const code =
      typeof data.code === "string" ? data.code : undefined;

    const fieldErrors: Record<string, string[]> = {};

    if (isRecord(data.errors)) {
      for (const [key, val] of Object.entries(data.errors)) {
        if (Array.isArray(val)) {
          fieldErrors[key] = val.map(String);
        } else if (typeof val === "string") {
          fieldErrors[key] = [val];
        }
      }
    }

    return {
      status,
      message,
      code,
      fieldErrors,
    };
  }

  return {
    status,
    message: "درخواست ناموفق بود",
  };
}

function getCsrfTokenFromCookie(): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie.match(
    /(?:^|;\s*)csrftoken=([^;]+)/,
  );

  return match ? decodeURIComponent(match[1]) : null;
}

let pendingCsrfRequest: Promise<string | null> | null = null;

async function ensureCsrfToken(): Promise<string | null> {
  // 1. اگر قبلاً token داریم، همان را استفاده کن
  const existingToken = getCsrfTokenFromCookie();

  if (existingToken) {
    return existingToken;
  }

  // 2. جلوگیری از چند درخواست همزمان برای گرفتن CSRF
  if (pendingCsrfRequest) {
    return pendingCsrfRequest;
  }

  pendingCsrfRequest = (async () => {
    try {
      const res = await fetch("/api/auth/csrf/", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        return null;
      }

      // Route Handler باید Set-Cookie را روی Browser ست کرده باشد
      return getCsrfTokenFromCookie();
    } catch {
      return null;
    } finally {
      pendingCsrfRequest = null;
    }
  })();

  return pendingCsrfRequest;
}

const MUTATING_METHODS = new Set([
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
]);

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const method = (init?.method ?? "GET").toUpperCase();

  const needsCsrf = MUTATING_METHODS.has(method);

  const headers = new Headers(init?.headers);

  // فقط اگر caller خودش Content-Type نداده باشد
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (needsCsrf) {
    const csrfToken = await ensureCsrfToken();

    if (csrfToken) {
      headers.set("X-CSRFToken", csrfToken);
    }
  }

  const res = await fetch(path, {
    ...init,
    method,
    credentials: "include",
    headers,
  });

  const text = await res.text();

  let data: unknown = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    throw new ApiClientError(
      normalizeError(res.status, data),
    );
  }

  return data as T;
}

