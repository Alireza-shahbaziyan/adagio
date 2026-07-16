"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Cart } from "@/types/cart";
import { queryKeys } from "@/lib/queryKeys";

async function cartRequest(path: string, init?: RequestInit): Promise<Cart> {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail || "درخواست سبد خرید ناموفق بود");
  }

  return res.json();
}

export function getCart(): Promise<Cart> {
  return cartRequest("/api/cart");
}

export function addCartItem(sku: string, quantity: number): Promise<Cart> {
  return cartRequest("/api/cart/items", {
    method: "POST",
    body: JSON.stringify({ sku, quantity }),
  });
}

export function updateCartItem(sku: string, quantity: number): Promise<Cart> {
  return cartRequest(`/api/cart/items/${sku}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(sku: string): Promise<Cart> {
  return cartRequest(`/api/cart/items/${sku}`, { method: "DELETE" });
}

export function useCart() {
  return useQuery({ queryKey: queryKeys.cart, queryFn: getCart });
}

export function useAddCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sku, quantity }: { sku: string; quantity: number }) =>
      addCartItem(sku, quantity),
    onSuccess: (cart) => queryClient.setQueryData(queryKeys.cart, cart),
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sku, quantity }: { sku: string; quantity: number }) =>
      updateCartItem(sku, quantity),
    onSuccess: (cart) => queryClient.setQueryData(queryKeys.cart, cart),
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sku: string) => removeCartItem(sku),
    onSuccess: (cart) => queryClient.setQueryData(queryKeys.cart, cart),
  });
}

/** Total item quantity across the cart, for the Navbar/MobileBottomNav badge. */
export function useCartItemCount() {
  const { data } = useCart();
  return data?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
}
