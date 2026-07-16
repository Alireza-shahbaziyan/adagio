"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Address, AddressPayload } from "@/types/address";
import { queryKeys } from "@/lib/queryKeys";
import { useMe } from "@/hooks/useMe";

async function addressRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail || "درخواست آدرس‌ها ناموفق بود");
  }

  return res.json();
}

// Some backend responses nest province/city as the related object ({id, name})
// instead of the plain id the rest of the app expects — normalize both shapes
// here, once, so every caller can rely on Address.province/city being numbers.
type RawAddress = Omit<Address, "province" | "city"> & {
  province: number | { id: number };
  city: number | { id: number };
};

function toId(value: number | { id: number }): number {
  return typeof value === "object" && value !== null ? value.id : value;
}

function normalizeAddress(raw: RawAddress): Address {
  return { ...raw, province: toId(raw.province), city: toId(raw.city) };
}

export async function getAddresses(): Promise<Address[]> {
  const data = await addressRequest<RawAddress[]>("/api/auth/addresses");
  return data.map(normalizeAddress);
}

export async function createAddress(payload: AddressPayload): Promise<Address> {
  const data = await addressRequest<RawAddress>("/api/auth/addresses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return normalizeAddress(data);
}

export async function updateAddress(id: number, payload: AddressPayload): Promise<Address> {
  const data = await addressRequest<RawAddress>(`/api/auth/addresses/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return normalizeAddress(data);
}

/** DELETE responds 204 with no body — bypasses addressRequest's JSON parsing. */
export async function deleteAddress(id: number): Promise<void> {
  const res = await fetch(`/api/auth/addresses/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (res.status === 204) return;

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail || "حذف آدرس ناموفق بود");
  }
}

export function useAddresses() {
  const { data: me } = useMe();
  return useQuery({
    queryKey: queryKeys.addresses,
    queryFn: getAddresses,
    enabled: !!me,
    staleTime: 5 * 60_000, // changes rarely — an occasional add/edit, not per-navigation
  });
}

// create/update return only the single affected Address (not the full list like
// cart/wishlist), and delete returns nothing — invalidate rather than setQueryData.

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddressPayload) => createAddress(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.addresses }),
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AddressPayload }) =>
      updateAddress(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.addresses }),
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAddress(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.addresses }),
  });
}
