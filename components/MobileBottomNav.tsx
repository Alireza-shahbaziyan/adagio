"use client";

import Link from "next/link";
import { useAppState } from "@/lib/app-state";
import { BagIcon, HeartIcon, HomeIcon, SearchIcon, UserIcon } from "@/components/icons";

export default function MobileBottomNav() {
  const { cartCount, wishlist } = useAppState();

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[1000] flex justify-around border-t border-white/[0.08] bg-[#111111]/95 px-2 pt-2.5 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "calc(10px + env(safe-area-inset-bottom))" }}
    >
      <Link href="/" className="flex h-11 w-11 items-center justify-center text-[#F3F3F3]">
        <HomeIcon />
      </Link>
      <Link href="/#featured" className="flex h-11 w-11 items-center justify-center text-[#A8A8A8]">
        <SearchIcon size={20} />
      </Link>
      <button className="relative flex h-11 w-11 items-center justify-center bg-transparent text-[#A8A8A8]">
        <HeartIcon size={20} />
        {wishlist.length > 0 && (
          <span className="absolute -top-0.5 -left-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#F3F3F3] text-[9px] font-semibold text-[#090909]">
            {wishlist.length}
          </span>
        )}
      </button>
      <button className="relative flex h-11 w-11 items-center justify-center bg-transparent text-[#A8A8A8]">
        <BagIcon size={20} />
        {cartCount > 0 && (
          <span className="absolute -top-0.5 -left-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#F3F3F3] text-[9px] font-semibold text-[#090909]">
            {cartCount}
          </span>
        )}
      </button>
      <Link href="/login" className="flex h-11 w-11 items-center justify-center text-[#A8A8A8]">
        <UserIcon size={20} />
      </Link>
    </div>
  );
}
