import { User } from "@/types/auth";

export async function verifyOtpApi(data: { phone: string; code: string }) {
  try {
    await fetch("/api/auth/csrf", {
      method: "GET",
      credentials: "include",
    });

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        phone: data.phone,
        code: data.code,
      }),
    });

    if (!res.ok) throw new Error("Verification failed");

    return res.json();
  } catch (error) {
    console.error(error);
    throw new Error("Verification failed");
  }
}

export async function loginApi({ phone }: { phone: string }) {
  await fetch("/api/auth/csrf", {
    method: "GET",
    credentials: "include",
  });

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ phone }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.detail || "Verification failed");
  }

  return data;
}

export async function getMe(): Promise<User | null> {
  await fetch("/api/auth/csrf", {
    method: "GET",
    credentials: "include",
  });

  const response = await fetch("/api/auth/me", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }

  try {
    return (await response.json()) as User;
  } catch (error) {
    console.error("Error in getMe:", error);
    return null;
  }
}