"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api-client";
import type { Cart } from "@/types/cart";
import { queryKeys } from "@/lib/queryKeys";

export function getCart(): Promise<Cart> {
  return apiRequest<Cart>("/api/cart");
}

export function addCartItem(sku: string, quantity: number): Promise<Cart> {
  return apiRequest<Cart>("/api/cart/items", {
    method: "POST",
    body: JSON.stringify({ sku, quantity }),
  });
}

export function updateCartItem(sku: string, quantity: number): Promise<Cart> {
  return apiRequest<Cart>(`/api/cart/items/${sku}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(sku: string): Promise<Cart> {
  return apiRequest<Cart>(`/api/cart/items/${sku}`, { method: "DELETE" });
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