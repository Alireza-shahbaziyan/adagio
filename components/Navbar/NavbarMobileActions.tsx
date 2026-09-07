import Link from "next/link";
import { BagIcon, HeartIcon, MenuIcon, SearchIcon } from "@/components/icons";
import { Badge } from "./Badge";

interface NavbarMobileActionsProps {
  variant: "home" | "product" | "default";
  cartCount: number;
  productWishlisted?: boolean;
  onToggleProductWishlist?: () => void;
  onSearchOpen: () => void;
  onMenuOpen: () => void;
}

export function NavbarMobileActions({
  variant,
  cartCount,
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
