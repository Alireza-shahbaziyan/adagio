import { apiRequest } from "@/lib/api-client";
import { logoutResponse, User } from "@/types/auth";

export async function verifyOtpApi(data: {
  phone: string;
  code: string;
}): Promise<Record<string, unknown>> {
  return apiRequest<Record<string, unknown>>("/api/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ phone: data.phone, code: data.code }),
  });
}

export async function loginApi({
  phone,
}: {
  phone: string;
}): Promise<Record<string, unknown>> {
  return apiRequest<Record<string, unknown>>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ phone }),
  });
}

export async function getMe(): Promise<User | null> {
  try {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as User;
  } catch (error) {
    console.error("getMe error:", error);
    return null;
  }
}

export async function logout(): Promise<logoutResponse> {
  return apiRequest<logoutResponse>("/api/auth/logout", {
    method: "POST",
  });
}
