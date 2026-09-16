"use client";

import Link from "next/link";

import { useWishlistCount } from "@/lib/wishlist";
import {  HomeIcon, UserIcon } from "@/components/icons";
import { useMembership } from "@/hooks/useMembership";
import { Heart, Home, Store } from "lucide-react";
import MobileNavLink from "@/components/MobileNavBottom/MobileNavLink";

export default function MobileBottomNav() {
  const wishlistCount = useWishlistCount();
  const { user: isUser , isGuest,isLoading } = useMembership();
  console.log(wishlistCount.toString())
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-1000 flex justify-around border-t border-white/8 bg-[#111111]/95 px-2 pt-2.5 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "calc(10px + env(safe-area-inset-bottom))" }}
    >
      <MobileNavLink link="/" icon={Store} />
      <MobileNavLink link="/store" icon={Home} />
      <MobileNavLink link="/store/wishlist" icon={Heart} value={wishlistCount.toString()}/>
    
    {isGuest&& <Link
        href="/login"
        className="flex h-11 w-11 items-center justify-center text-muted-foreground"
      >
        <UserIcon size={20} />
      </Link>}

    </div>
  );
}
