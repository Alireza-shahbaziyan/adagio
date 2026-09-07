import Link from "next/link";
import { BagIcon, HeartIcon, SearchIcon, UserIcon } from "@/components/icons";
import { Badge } from "./Badge";
import { User } from "@/types/auth";
import Image from "next/image";

interface NavbarDesktopActionsProps {
  variant: "home" | "product" | "default";
  isMember: boolean;
  wishlistCount: number;
  cartCount: number;
  user: User | null;
  productWishlisted?: boolean;
  onToggleProductWishlist?: () => void;
  onSearchOpen: () => void;
}

export function NavbarDesktopActions({
  user,
  variant,
  isMember,
  wishlistCount,
  cartCount,
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
        <SearchIcon />
      </button>
      {variant === "product" ? (
        <button
          onClick={onToggleProductWishlist}
          className="relative flex p-2 text-foreground"
          type="button"
        >
          <HeartIcon filled={productWishlisted} />
        </button>
      ) : (
        <Link
          href="/store/wishlist"
          className="relative flex p-2 text-foreground"
        >
          <HeartIcon />
          <Badge count={wishlistCount} />
        </Link>
      )}
      <Link href="/store/cart" className="relative flex p-2 text-foreground">
        <BagIcon />
        <Badge count={cartCount} />
      </Link>
      {isMember ? (
        <Link href="/profile" className="flex p-2 text-foreground">
          <span className="mr-2 text-sm text-white">
            {user?.full_name || `0${user?.phone}` || "پروفایل"}
          </span>
          {user?.avatar && (
            <Image
              src={user.avatar}
              alt={user.full_name ?? "Profile"}
              width={24}
              height={24}
              className="rounded-full object-cover"
            />
          )}
        </Link>
      ) : (
        <Link href="/login" className="flex p-2 text-foreground">
          <UserIcon />
        </Link>
      )}
    </div>
  );
}
