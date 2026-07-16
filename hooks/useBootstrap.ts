"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import type { Bootstrap } from "@/types/bootstrap";

async function getBootstrap(): Promise<Bootstrap> {
  const res = await fetch("/api/auth/bootstrap", { credentials: "include" });
  if (!res.ok) throw new Error("درخواست اطلاعات اولیه ناموفق بود");
  return res.json();
}

/**
 * Stub for the combined session+cart+wishlist bootstrap call — not yet wired
 * into Navbar/MobileBottomNav. See app/api/auth/bootstrap/route.ts.
 */
export function useBootstrap() {
  return useQuery({
    queryKey: queryKeys.bootstrap,
    queryFn: getBootstrap,
    staleTime: 30_000,
  });
}
