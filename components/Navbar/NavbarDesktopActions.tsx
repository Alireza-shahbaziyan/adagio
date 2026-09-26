"use client";

import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import {
  BagIcon,
  ChevronDownIcon,
  HeartIcon,
  SearchIcon,
  UserIcon,
} from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "./Badge";
import { User } from "@/types/auth";

interface NavbarDesktopActionsProps {
  variant: "home" | "product" | "default";
  wishlistCount: number;
  cartCount: number;
  user: User | null;
  accountMenu: ReactNode;
  productWishlisted?: boolean;
  onToggleProductWishlist?: () => void;
  onSearchOpen: () => void;
}

const ACCOUNT_TRIGGER_CLASS =
  "flex items-center gap-2 rounded-full p-2 text-foreground outline-none transition-colors hover:bg-white/8 focus-visible:ring-2 focus-visible:ring-ring/50 data-popup-open:bg-white/10";

export function NavbarDesktopActions({
  user,
  variant,
  wishlistCount,
  cartCount,
  accountMenu,
  productWishlisted,
  onToggleProductWishlist,
  onSearchOpen,
}: NavbarDesktopActionsProps) {
  return (
    <div className="hidden items-center gap-6 md:flex">
      <button
        onClick={onSearchOpen}
        className="flex p-2 text-foreground"
        type="button"
      >
        <SearchIcon size={28} />
      </button>
      {variant === "product" ? (
        <button
          onClick={onToggleProductWishlist}
          className="relative flex p-2 text-foreground"
          type="button"
        >
          <HeartIcon size={28} filled={productWishlisted} />
        </button>
      ) : (
        <Link
          href="/store/wishlist"
          className="relative flex p-2 text-foreground"
        >
          <HeartIcon size={28} />
          <Badge count={wishlistCount} />
        </Link>
      )}
      <Link href="/store/cart" className="relative flex p-2 text-foreground">
        <BagIcon size={28} />
        <Badge count={cartCount} />
      </Link>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          openOnHover
          delay={100}
          closeDelay={100}
          aria-label={user ? undefined : "منوی حساب کاربری"}
          className={ACCOUNT_TRIGGER_CLASS}
        >
          {user ? (
            <>
              {user.avatar && (
                <Image
                  src={user.avatar}
                  alt=""
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
              )}
              <span className="max-w-36 truncate text-sm text-white">
                {user.full_name || `0${user.phone}`}
              </span>
            </>
          ) : (
            <UserIcon size={28} />
          )}
          <span
            aria-hidden="true"
            className="ms-auto flex text-foreground/60 transition-transform duration-200 data-popup-open:rotate-180"
          >
            <ChevronDownIcon size={14} />
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="min-w-52"
        >
          {accountMenu}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
