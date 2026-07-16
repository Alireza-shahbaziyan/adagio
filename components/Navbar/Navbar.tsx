"use client";

import Link from "next/link";
import { useState } from "react";
import { useCartItemCount } from "@/lib/cart";
import { useWishlistCount } from "@/lib/wishlist";
import { useScrollY } from "@/lib/hooks";
import {
  BagIcon,
  CloseIcon,
  HeartIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
} from "@/components/icons";
import SearchDialog from "@/components/SearchDialog";
import { useMembership } from "@/hooks/useMembership";

const NAV_LINKS = [
  { href: "/store", label: "فروشگاه" },
  // { href: "/#dashboard", label: "پنل کاربری" },
  { href: "/collections", label: "کالکشن‌ها" },
  { href: "/about", label: "درباره" },
  { href: "/#law", label: "قوانین و مقررات" },
  { href: "/contact-me", label: "تماس" },
];

function Badge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span className="absolute -top-0.5 -left-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[9px] font-semibold text-primary-foreground">
      {count}
    </span>
  );
}

export default function Navbar({
  variant,
  productWishlisted,
  onToggleProductWishlist,
}: {
  variant: "home" | "product" | "default";
  productWishlisted?: boolean;
  onToggleProductWishlist?: () => void;
}) {
  
  const { isMember } = useMembership();
  const wishlistCount = useWishlistCount();
  const cartCount = useCartItemCount();

  const scrollY = useScrollY();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navSolid = variant !== "home" || scrollY > 40;
  const position = variant === "home" ? "fixed" : "sticky";

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

        {/* Desktop */}
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
        <div className="hidden items-center gap-6 md:flex">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex p-2 text-foreground"
          >
            <SearchIcon />
          </button>
          {variant === "product" ? (
            <button
              onClick={onToggleProductWishlist}
              className="relative flex p-2 text-foreground"
            >
              <HeartIcon filled={productWishlisted} />
            </button>
          ) : (
            <Link
              href="/wishlist"
              className="relative flex p-2 text-foreground"
            >
              <HeartIcon />
              <Badge count={wishlistCount} />
            </Link>
          )}
          <Link href="/cart" className="relative flex p-2 text-foreground">
            <BagIcon />
            <Badge count={cartCount} />
          </Link>
          {isMember ? (
            <p>خوش آمدید</p>
          ) : (
            <Link href="/login" className="flex p-2 text-foreground">
              <UserIcon />
            </Link>
          )}
        </div>

        {/* Mobile */}
        {variant !== "product" && (
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex p-2 text-foreground"
            >
              <SearchIcon />
            </button>
            <Link href="/cart" className="relative flex p-2 text-foreground">
              <BagIcon />
              <Badge count={cartCount} />
            </Link>

            <button
              onClick={() => setMenuOpen(true)}
              className="flex p-2 text-foreground"
            >
              <MenuIcon />
            </button>
          </div>
        )}
        {variant === "product" && (
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={onToggleProductWishlist}
              className="relative flex p-2 text-foreground"
            >
              <HeartIcon filled={productWishlisted} />
            </button>
            <Link href="/cart" className="relative flex p-2 text-foreground">
              <BagIcon />
              <Badge count={cartCount} />
            </Link>
          </div>
        )}
      </nav>

      {variant !== "product" && menuOpen && (
        <div
          style={{ animation: "fadeInSoft 0.3s ease" }}
          className="fixed inset-0 z-[5000] flex flex-col bg-primary-foreground p-6 md:hidden"
        >
          <div className="mb-12 flex items-center justify-between">
            <span
              style={{ direction: "ltr" }}
              className="font-instrument-serif text-[26px] italic text-foreground"
            >
              Adagio
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              className="flex p-2 text-foreground"
            >
              <CloseIcon />
            </button>
          </div>
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="border-b border-white/8 py-4.5 text-[28px] font-bold text-foreground"
            >
              {l.label}
            </Link>
          ))}
          {isMember && (
            <Link
              key={"AS"}
              href={"#"}
              onClick={() => setMenuOpen(false)}
              className="border-b border-white/8 py-4.5 text-[28px] font-bold text-foreground"
            >
              AAA
            </Link>
          )}
          {!isMember && (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="pt-6 text-base text-muted-foreground  border-b border-white
               pb-2 w-fit hover:text-primary focus:text-white focus:border-muted-foreground"
            >
              ورود / حساب کاربری
            </Link>
          )}
        </div>
      )}

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
