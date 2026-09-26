"use client";

import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import {
  BagIcon,
  HeartIcon,
  MenuIcon,
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

interface NavbarMobileActionsProps {
  variant: "home" | "product" | "default";
  cartCount: number;
  user: User | null;
  accountMenu: ReactNode;
  productWishlisted?: boolean;
  onToggleProductWishlist?: () => void;
  onSearchOpen: () => void;
  onMenuOpen: () => void;
}

const ACCOUNT_TRIGGER_CLASS =
  "flex rounded-full p-2 text-foreground outline-none transition-colors hover:bg-white/8 focus-visible:ring-2 focus-visible:ring-ring/50 data-popup-open:bg-white/10";

export function NavbarMobileActions({
  variant,
  cartCount,
  user,
  accountMenu,
  productWishlisted,
  onToggleProductWishlist,
  onSearchOpen,
  onMenuOpen,
}: NavbarMobileActionsProps) {
  if (variant === "product") {
    return (
      <div className="flex items-center gap-4 md:hidden">
        <button
          onClick={onToggleProductWishlist}
          className="relative flex p-2 text-foreground"
          type="button"
        >
          <HeartIcon filled={productWishlisted} />
        </button>
        <Link href="/cart" className="relative flex p-2 text-foreground">
          <BagIcon />
          <Badge count={cartCount} />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 md:hidden">
      <button
        onClick={onSearchOpen}
        className="flex p-2 text-foreground"
        type="button"
      >
        <SearchIcon />
      </button>
      <Link href="/cart" className="relative flex p-2 text-foreground">
        <BagIcon />
        <Badge count={cartCount} />
      </Link>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          aria-label="منوی حساب کاربری"
          className={ACCOUNT_TRIGGER_CLASS}
        >
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt=""
              width={28}
              height={28}
              className="rounded-full object-cover"
            />
          ) : (
            <UserIcon />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="min-w-52"
        >
          {accountMenu}
        </DropdownMenuContent>
      </DropdownMenu>
      <button
        onClick={onMenuOpen}
        className="flex p-2 text-foreground"
        type="button"
      >
        <MenuIcon />
      </button>
    </div>
  );
}
