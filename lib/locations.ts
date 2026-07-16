"use client";

import { useQuery } from "@tanstack/react-query";
import type { Province, City } from "@/types/location";
import { queryKeys } from "@/lib/queryKeys";
import { useMe } from "@/hooks/useMe";

async function locationRequest<T>(path: string): Promise<T> {
  const res = await fetch(path, { credentials: "include" });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail || "درخواست اطلاعات مکانی ناموفق بود");
  }

  return res.json();
}

export function getProvinces(): Promise<Province[]> {
  return locationRequest("/api/auth/provinces");
}

export function getCities(provinceId: number): Promise<City[]> {
  return locationRequest(`/api/auth/provinces/${provinceId}/cities`);
}

// The backend groups these under /api/auth/ and requires a session — gate on useMe()
// the same way useAddresses() does, rather than treating them as public reference data.

// Provinces/cities are static reference data — never expected to change within
// a session, so they never need to go stale and refetch.

export function useProvinces() {
  const { data: me } = useMe();
  return useQuery({
    queryKey: queryKeys.provinces,
    queryFn: getProvinces,
    enabled: !!me,
    staleTime: Infinity,
  });
}

export function useCities(provinceId: number | null) {
  const { data: me } = useMe();
  return useQuery({
    queryKey: queryKeys.cities(provinceId ?? 0),
    queryFn: () => getCities(provinceId as number),
    enabled: !!me && !!provinceId,
    staleTime: Infinity,
  });
}
