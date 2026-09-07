"use client";

import Link from "next/link";
import { useState } from "react";
import { useCartItemCount } from "@/lib/cart";
import { useWishlistCount } from "@/lib/wishlist";
import { useScrollY } from "@/lib/hooks";
import SearchDialog from "@/components/SearchDialog";
import { useMembership } from "@/hooks/useMembership";
import { NavbarDesktopActions } from "./NavbarDesktopActions";
import { NavbarMobileActions } from "./NavbarMobileActions";
import { MobileMenu } from "./MobileMenu";

const NAV_LINKS = [
  { href: "/store", label: "فروشگاه" },
  { href: "/blog", label: "بلاگ" },
  { href: "/store/collections", label: "کالکشن‌ها" },
  { href: "/store/categories", label: "دستبه‌بندی" },
  { href: "/store/order-guide", label: "راهنمای‌خرید" },
  { href: "/about", label: "درباره" },
  { href: "/contact-me", label: "تماس" },
];

export default function Navbar({
  variant,
  productWishlisted,
  onToggleProductWishlist,
}: {
  variant: "home" | "product" | "default";
  productWishlisted?: boolean;
  onToggleProductWishlist?: () => void;
}) {
  const { user, isMember, isLoading } = useMembership();
  const wishlistCount = useWishlistCount();
  const cartCount = useCartItemCount();
  const scrollY = useScrollY();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navSolid = variant !== "home" || scrollY > 40;
  const position = variant === "home" ? "fixed" : "sticky";
  if (isLoading)
    return (
  
      <div className="w-full h-20 flex justify-center items-center py-4">
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center ">
          <div className="absolute inset-0 animate-ping rounded-full border border-white/20" />

          <div className="h-12 w-12 animate-spin rounded-full border border-white/20 border-t-white" />

          <div className="absolute h-2 w-2 animate-pulse rounded-full bg-white" />
        </div>
      </div>
    );
  return (
    <>
      <nav
        style={{
          position,
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: navSolid ? "rgba(9,9,9,0.78)" : "transparent",
          borderBottom: navSolid
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid transparent",
          backdropFilter: navSolid ? "blur(20px)" : "none",
          transition:
            "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
        }}
        className="flex items-center justify-between px-5 py-5 md:px-16"
      >
        <Link
          href="/"
          style={{ direction: "ltr" }}
          className="font-instrument-serif text-[26px] italic text-foreground tracking-[0.3px]"
        >
          Adagio
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm tracking-[0.2px] text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <NavbarDesktopActions
          user={user ?? null}
          variant={variant}
          isMember={isMember}
          wishlistCount={wishlistCount}
          cartCount={cartCount}
          productWishlisted={productWishlisted}
          onToggleProductWishlist={onToggleProductWishlist}
          onSearchOpen={() => setSearchOpen(true)}
        />

        <NavbarMobileActions
          variant={variant}
          cartCount={cartCount}
          productWishlisted={productWishlisted}
          onToggleProductWishlist={onToggleProductWishlist}
          onSearchOpen={() => setSearchOpen(true)}
          onMenuOpen={() => setMenuOpen(true)}
        />
      </nav>

      {variant !== "product" && menuOpen && (
        <MobileMenu isMember={isMember} onClose={() => setMenuOpen(false)} />
      )}

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
