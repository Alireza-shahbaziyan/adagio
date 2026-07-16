"use client";

import Link from "next/link";
import { useCartItemCount } from "@/lib/cart";
import { useWishlistCount } from "@/lib/wishlist";
import {
  BagIcon,
  HeartIcon,
  HomeIcon,
  SearchIcon,
  UserIcon,
} from "@/components/icons";

export default function MobileBottomNav() {
  const wishlistCount = useWishlistCount();
  const cartCount = useCartItemCount();

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[1000] flex justify-around border-t border-white/8 bg-[#111111]/95 px-2 pt-2.5 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "calc(10px + env(safe-area-inset-bottom))" }}
    >
      <Link
        href="/"
        className="flex h-11 w-11 items-center justify-center text-foreground"
      >
        <HomeIcon />
      </Link>
      <Link
        href="/store#featured"
        className="flex h-11 w-11 items-center justify-center text-muted-foreground"
      >
        <SearchIcon size={20} />
      </Link>
      <Link
        href="/wishlist"
        className="relative flex h-11 w-11 items-center justify-center text-muted-foreground"
      >
        <HeartIcon size={20} />
        {wishlistCount > 0 && (
          <span className="absolute -top-0.5 -left-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[9px] font-semibold text-primary-foreground">
            {wishlistCount}
          </span>
        )}
      </Link>
      <Link
        href="/cart"
        className="relative flex h-11 w-11 items-center justify-center text-muted-foreground"
      >
        <BagIcon size={20} />
        {cartCount > 0 && (
          <span className="absolute -top-0.5 -left-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[9px] font-semibold text-primary-foreground">
            {cartCount}
          </span>
        )}
      </Link>
      <Link
        href="/login"
        className="flex h-11 w-11 items-center justify-center text-muted-foreground"
      >
        <UserIcon size={20} />
      </Link>
    </div>
  );
}
