import { BagIcon, HeartIcon, SearchIcon, UserIcon } from "@/components/icons";
import { Badge } from "./Badge";
import { NavActionButton, NavActionLink } from "./NavAction";
import { ProfileMenu } from "./ProfileMenu";
import type { User } from "@/types/auth";

interface NavbarDesktopActionsProps {
  variant: "home" | "product" | "default";
  isMember: boolean;
  wishlistCount: number;
  cartCount: number;
  user: User | null;
  isLoading: boolean;
  productWishlisted?: boolean;
  onToggleProductWishlist?: () => void;
  onSearchOpen: () => void;
  onLogout: () => void;
  logoutPending: boolean;
}

export function NavbarDesktopActions({
  user,
  variant,
  isMember,
  wishlistCount,
  cartCount,
  isLoading,
  productWishlisted,
  onToggleProductWishlist,
  onSearchOpen,
  onLogout,
  logoutPending,
}: NavbarDesktopActionsProps) {
  return (
    <div className="hidden items-center gap-1 md:flex lg:gap-2">
      <NavActionButton label="جستجو" onClick={onSearchOpen}>
        <SearchIcon />
      </NavActionButton>

      {variant === "product" ? (
        <NavActionButton
          label={productWishlisted ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
          aria-pressed={productWishlisted}
          onClick={onToggleProductWishlist}
        >
          <HeartIcon filled={productWishlisted} />
        </NavActionButton>
      ) : (
        <NavActionLink href="/store/wishlist" label="علاقه‌مندی‌ها">
          <HeartIcon />
          <Badge count={wishlistCount} />
        </NavActionLink>
      )}

      <NavActionLink href="/store/cart" label="سبد خرید">
        <BagIcon />
        <Badge count={cartCount} />
      </NavActionLink>

      {isMember || isLoading ? (
        <ProfileMenu
          user={user}
          isLoading={isLoading}
          onLogout={onLogout}
          logoutPending={logoutPending}
        />
      ) : (
        <NavActionLink href="/login" label="ورود به حساب کاربری">
          <UserIcon />
        </NavActionLink>
      )}
    </div>
  );
}
