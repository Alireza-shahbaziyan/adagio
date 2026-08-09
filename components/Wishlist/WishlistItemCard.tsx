"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useRemoveWishlistItem } from "@/lib/wishlist";
import { useAppState } from "@/lib/app-state";
import { Button } from "@/components/ui/button";
import type { WishlistItem } from "@/types/wishlist";

export default function WishlistItemCard({ item }: { item: WishlistItem }) {
  const removeItem = useRemoveWishlistItem();
  const { showToast } = useAppState();

  const addedAt = new Date(item.created_at).toLocaleDateString("fa-IR");

  return (
    <div className="flex items-center gap-4 rounded-[20px] border border-white/8 bg-[#111111] p-5">
      <Link href={`/store/products/${item.slug}`} className="min-w-0 flex-1">
        <p className="mb-1 truncate text-[15px] text-foreground">
          {item.title}
        </p>
        <p className="text-sm text-muted-foreground">افزوده‌شده در {addedAt}</p>
      </Link>

      <Button
        variant="ghost"
        size="icon-sm"
        disabled={removeItem.isPending}
        aria-label="حذف از علاقه‌مندی‌ها"
        onClick={() =>
          removeItem.mutate(item.slug, {
            onSuccess: () => showToast(`${item.title} از علاقه‌مندی‌ها حذف شد`),
            onError: (err) => showToast(err.message),
          })
        }
      >
        <Trash2 />
      </Button>
    </div>
  );
}
