"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api-client";
import type { Address, AddressPayload } from "@/types/address";
import type { PaginatedResponse } from "@/types/response";
import { queryKeys } from "@/lib/queryKeys";
import { useMembership } from "@/hooks/useMembership";

// Some backend responses nest province/city as the related object ({id, name})
// instead of the plain id the rest of the app expects — normalize both shapes
// here, once, so every caller can rely on Address.province/city being numbers.
type RawAddress = Omit<Address, "province" | "city"> & {
  province: number | { id: number };
  city: number | { id: number };
};

type RawAddressResponse = PaginatedResponse<RawAddress>;

function toId(value: number | { id: number }): number {
  return typeof value === "object" && value !== null ? value.id : value;
}

function normalizeAddress(raw: RawAddress): Address {
  return { ...raw, province: toId(raw.province), city: toId(raw.city) };
}

export async function getAddresses(): Promise<Address[]> {
  const data = await apiRequest<RawAddressResponse>("/api/auth/addresses");
  return data.results.map(normalizeAddress);
}

export async function createAddress(payload: AddressPayload): Promise<Address> {
  const data = await apiRequest<RawAddress>("/api/auth/addresses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return normalizeAddress(data);
}

export async function updateAddress(id: number, payload: AddressPayload): Promise<Address> {
  const data = await apiRequest<RawAddress>(`/api/auth/addresses/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return normalizeAddress(data);
}

export async function deleteAddress(id: number): Promise<void> {
  await apiRequest<void>(`/api/auth/addresses/${id}`, {
    method: "DELETE",
  });
}

export function useAddresses() {
  const { isMember } = useMembership();
  return useQuery({
    queryKey: queryKeys.addresses,
    queryFn: getAddresses,
    enabled: isMember,
    staleTime: 5 * 60_000,
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