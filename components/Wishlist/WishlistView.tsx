"use client";

import Link from "next/link";
import { useMe } from "@/hooks/useMe";
import { useWishlist } from "@/lib/wishlist";
import { Skeleton } from "@/components/ui/skeleton";
import WishlistLoginPrompt from "@/components/Wishlist/WishlistLoginPrompt";
import WishlistGrid from "@/components/Wishlist/WishlistGrid";

function WishlistSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-20 pt-28 md:px-16 md:pt-40">
      <div className="flex flex-col gap-4">
        {[0, 1, 2].map((i) => (
          <Skeleton
            key={i}
            className="h-24 w-full rounded-[20px] bg-[#181818]"
          />
        ))}
      </div>
    </div>
  );
}

export default function WishlistView() {
  const { data: me, isLoading: meLoading } = useMe();

  if (meLoading) return <WishlistSkeleton />;
  if (!me) return <WishlistLoginPrompt />;

  return <AuthedWishlist />;
}

function AuthedWishlist() {
  const { data, isLoading, isError } = useWishlist();

  if (isLoading) return <WishlistSkeleton />;
  // An expired/invalid session surfaces here as a fetch error — treat it the
  // same as "not logged in" instead of showing a generic error+retry block.
  if (isError) return <WishlistLoginPrompt />;

  const items = data ?? [];

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 pb-20 pt-28 md:px-16 md:pt-40">
        <div className="rounded-[20px] border border-white/8 bg-[#111111] px-8 py-20 text-center">
          <p className="mb-3 text-lg font-bold text-foreground">
            علاقه‌مندی‌هایت خالی است
          </p>
          <p className="mb-8 text-sm text-muted-foreground">
            محصولی اضافه نشده — از فروشگاه شروع کن.
          </p>
          <Link
            href="/store"
            className="inline-block rounded-full border border-white/25 px-7 py-3 text-sm text-foreground transition-colors hover:border-white/60 hover:bg-white/8"
          >
            رفتن به فروشگاه
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 pb-20 pt-28 md:px-16 md:pt-40">
      <h1 className="mb-8 text-[28px] font-black leading-[1.15] text-foreground md:text-[44px]">
        علاقه‌مندی‌ها
      </h1>
      <WishlistGrid items={items} />
    </div>
  );
}
