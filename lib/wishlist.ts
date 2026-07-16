"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { WishlistItem } from "@/types/wishlist";
import { queryKeys } from "@/lib/queryKeys";
import { useMe } from "@/hooks/useMe";
import { useAppState } from "@/lib/app-state";

async function wishlistRequest(
  path: string,
  init?: RequestInit,
): Promise<WishlistItem[]> {
  const res = await fetch(path, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail || "درخواست علاقه‌مندی‌ها ناموفق بود");
  }

  return res.json();
}

export function getWishlist(): Promise<WishlistItem[]> {
  return wishlistRequest("/api/wishlist");
}

export function addWishlistItem(slug: string): Promise<WishlistItem[]> {
  return wishlistRequest("/api/wishlist/items", {
    method: "POST",
    body: JSON.stringify({ slug }),
  });
}

export function removeWishlistItem(slug: string): Promise<WishlistItem[]> {
  return wishlistRequest(`/api/wishlist/items/${slug}`, { method: "DELETE" });
}

export function useWishlist() {
  const { data: me } = useMe();
  return useQuery({
    queryKey: queryKeys.wishlist,
    queryFn: getWishlist,
    enabled: !!me,
  });
}

export function useAddWishlistItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => addWishlistItem(slug),
    onSuccess: (items) => queryClient.setQueryData(queryKeys.wishlist, items),
  });
}

export function useRemoveWishlistItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => removeWishlistItem(slug),
    onSuccess: (items) => queryClient.setQueryData(queryKeys.wishlist, items),
  });
}

/** Item count for the Navbar/MobileBottomNav badge. */
export function useWishlistCount() {
  const { data } = useWishlist();
  return data?.length ?? 0;
}

/** Shared auth-gated add/remove toggle used by ProductCard and ProductDetail's heart buttons. */
export function useWishlistToggle(slug: string, title: string) {
  const { data: me } = useMe();
  const { data } = useWishlist();
  const addItem = useAddWishlistItem();
  const removeItem = useRemoveWishlistItem();
  const { showToast } = useAppState();

  const isWishlisted = data?.some((item) => item.slug === slug) ?? false;

  const toggle = () => {
    if (!me) {
      showToast("برای افزودن به علاقه‌مندی‌ها ابتدا وارد شو");
      return;
    }

    if (isWishlisted) {
      removeItem.mutate(slug, {
        onSuccess: () => showToast(`${title} از علاقه‌مندی‌ها حذف شد`),
        onError: (err) => showToast(err.message),
      });
    } else {
      addItem.mutate(slug, {
        onSuccess: () => showToast(`${title} به علاقه‌مندی‌ها اضافه شد`),
        onError: (err) => showToast(err.message),
      });
    }
  };

  return { isWishlisted, toggle, isPending: addItem.isPending || removeItem.isPending };
}
