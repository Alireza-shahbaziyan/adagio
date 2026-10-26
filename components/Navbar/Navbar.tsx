"use client";

import Link from "next/link";
import { useState } from "react";

import { useCartItemCount } from "@/lib/cart";
import { useWishlistCount } from "@/lib/wishlist";
import { useScrollY } from "@/lib/hooks";
import { useAppState } from "@/lib/app-state";
import SearchDialog from "@/components/SearchDialog";
import { useMembership } from "@/hooks/useMembership";
import { useLogout } from "@/hooks/useLogout";
import { NavbarDesktopActions } from "./NavbarDesktopActions";
import { NavbarMobileActions } from "./NavbarMobileActions";
import { MobileMenu } from "./MobileMenu";
import { NAV_LINKS } from "./navLinks";

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
  const { mutate: logout, isPending: logoutPending } = useLogout();
  const { showToast } = useAppState();
  const wishlistCount = useWishlistCount();
  const cartCount = useCartItemCount();
  const scrollY = useScrollY();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navSolid = variant !== "home" || scrollY > 40;
  const position = variant === "home" ? "fixed" : "sticky";

  function handleLogout() {
    logout(undefined, {
      onSuccess: () => showToast("شما با موفقیت خارج شدید"),
      onError: () => showToast("خروج از حساب کاربری ناموفق بود"),
    });
  }

  const actionProps = {
    user: user ?? null,
    isMember,
    isLoading,
    cartCount,
    productWishlisted,
    onToggleProductWishlist,
    onSearchOpen: () => setSearchOpen(true),
    onLogout: handleLogout,
    logoutPending,
  };

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
        className="flex h-16 items-center justify-between gap-3 px-4 md:h-20 md:px-10 lg:px-16"
      >
        <Link
          href="/"
          style={{ direction: "ltr" }}
          className="shrink-0 rounded-sm font-instrument-serif text-[24px] italic tracking-[0.3px] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 md:text-[26px]"
        >
          Adagio
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-7 md:flex lg:gap-9">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-sm tracking-[0.2px] text-foreground/85 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <NavbarDesktopActions
          {...actionProps}
          variant={variant}
          wishlistCount={wishlistCount}
        />

        <NavbarMobileActions
          {...actionProps}
          variant={variant}
          onMenuOpen={() => setMenuOpen(true)}
        />
      </nav>

      {variant !== "product" && menuOpen && (
        <MobileMenu
          user={user ?? null}
          isMember={isMember}
          logoutPending={logoutPending}
          onLogout={handleLogout}
          onClose={() => setMenuOpen(false)}
        />
      )}

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
