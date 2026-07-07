"use client";

import Link from "next/link";
import { useState } from "react";
import { useAppState } from "@/lib/app-state";
import { useScrollY } from "@/lib/hooks";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon } from "@/components/icons";

const NAV_LINKS = [
  { href: "/store", label: "فروشگاه" },
  { href: "/collections", label: "کالکشن‌ها" },
  { href: "/about", label: "درباره" },
  { href: "/contact-me", label: "تماس" },
];

function Badge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span className="absolute -top-0.5 -left-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#F3F3F3] text-[9px] font-semibold text-[#090909]">
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
  const { cartCount, wishlist } = useAppState();
  const scrollY = useScrollY();
  const [menuOpen, setMenuOpen] = useState(false);

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
          borderBottom: navSolid ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
          backdropFilter: navSolid ? "blur(20px)" : "none",
          transition: "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
        }}
        className="flex items-center justify-between px-5 py-5 md:px-16"
      >
        <Link
          href="/"
          style={{ direction: "ltr" }}
          className="font-instrument-serif text-[26px] italic text-[#F3F3F3] tracking-[0.3px]"
        >
          Adagio
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm tracking-[0.2px] text-[#F3F3F3]">
              {l.label}
            </Link>
          ))}
        </div>
        <div className="hidden items-center gap-6 md:flex">
          <button className="flex p-2 text-[#F3F3F3]">
            <SearchIcon />
          </button>
          {variant === "product" ? (
            <button onClick={onToggleProductWishlist} className="relative flex p-2 text-[#F3F3F3]">
              <HeartIcon filled={productWishlisted} />
            </button>
          ) : (
            <button className="relative flex p-2 text-[#F3F3F3]">
              <HeartIcon />
              <Badge count={wishlist.length} />
            </button>
          )}
          <button className="relative flex p-2 text-[#F3F3F3]">
            <BagIcon />
            <Badge count={cartCount} />
          </button>
          <Link href="/login" className="flex p-2 text-[#F3F3F3]">
            <UserIcon />
          </Link>
        </div>

        {/* Mobile */}
        {variant !== "product" && (
          <div className="flex items-center gap-4 md:hidden">
            <button className="flex p-2 text-[#F3F3F3]">
              <SearchIcon />
            </button>
            <button onClick={() => setMenuOpen(true)} className="flex p-2 text-[#F3F3F3]">
              <MenuIcon />
            </button>
          </div>
        )}
        {variant === "product" && (
          <div className="flex items-center gap-4 md:hidden">
            <button onClick={onToggleProductWishlist} className="relative flex p-2 text-[#F3F3F3]">
              <HeartIcon filled={productWishlisted} />
            </button>
            <button className="relative flex p-2 text-[#F3F3F3]">
              <BagIcon />
              <Badge count={cartCount} />
            </button>
          </div>
        )}
      </nav>

      {variant !== "product" && menuOpen && (
        <div
          style={{ animation: "fadeInSoft 0.3s ease" }}
          className="fixed inset-0 z-[2000] flex flex-col bg-[#090909] p-6 md:hidden"
        >
          <div className="mb-12 flex items-center justify-between">
            <span
              style={{ direction: "ltr" }}
              className="font-[family-name:var(--font-instrument-serif)] text-[26px] italic text-[#F3F3F3]"
            >
              Adagio
            </span>
            <button onClick={() => setMenuOpen(false)} className="flex p-2 text-[#F3F3F3]">
              <CloseIcon />
            </button>
          </div>
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="border-b border-white/[0.08] py-[18px] text-[28px] font-bold text-[#F3F3F3]"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/login" onClick={() => setMenuOpen(false)} className="pt-6 text-base text-[#A8A8A8]">
            ورود / حساب کاربری
          </Link>
        </div>
      )}
    </>
  );
}
