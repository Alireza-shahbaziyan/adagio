import { User } from "@/types/auth";

export async function verifyOtpApi(data: { phone: string; code: string }) {
  const res = await fetch("/api/auth/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ phone: data.phone, code: data.code }),
  });
  if (!res.ok) throw new Error("Verification failed");

  return res.json();
}

export async function loginApi({ phone }: { phone: string }) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.detail || "Verification failed");
  }
  // console.log(data);

  return data;
}



export async function getMe(): Promise<User | null> {
  const response = await fetch("/api/auth/me", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) return null;

  const rawText = await response.text();
  try {
    return JSON.parse(rawText) as User;
  } catch {
    return null;
  }
}
