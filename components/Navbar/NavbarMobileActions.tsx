import { BagIcon, HeartIcon, MenuIcon, SearchIcon } from "@/components/icons";
import { Badge } from "./Badge";
import { NavActionButton, NavActionLink } from "./NavAction";
import { ProfileMenu } from "./ProfileMenu";
import type { User } from "@/types/auth";

interface NavbarMobileActionsProps {
  variant: "home" | "product" | "default";
  cartCount: number;
  user: User | null;
  isMember: boolean;
  isLoading: boolean;
  productWishlisted?: boolean;
  onToggleProductWishlist?: () => void;
  onSearchOpen: () => void;
  onMenuOpen: () => void;
  onLogout: () => void;
  logoutPending: boolean;
}

export function NavbarMobileActions({
  variant,
  cartCount,
  user,
  isMember,
  isLoading,
  productWishlisted,
  onToggleProductWishlist,
  onSearchOpen,
  onMenuOpen,
  onLogout,
  logoutPending,
}: NavbarMobileActionsProps) {
  if (variant === "product") {
    return (
      <div className="flex items-center gap-0.5 md:hidden">
        <NavActionButton
          label={
            productWishlisted
              ? "حذف از علاقه‌مندی‌ها"
              : "افزودن به علاقه‌مندی‌ها"
          }
          aria-pressed={productWishlisted}
          onClick={onToggleProductWishlist}
        >
          <HeartIcon filled={productWishlisted} />
        </NavActionButton>
        <NavActionLink href="/store/cart" label="سبد خرید">
          <BagIcon />
          <Badge count={cartCount} />
        </NavActionLink>
        {(isMember || isLoading) && (
          <ProfileMenu
            user={user}
            isLoading={isLoading}
            onLogout={onLogout}
            logoutPending={logoutPending}
            compact
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0.5 md:hidden">
      <NavActionButton label="جستجو" onClick={onSearchOpen}>
        <SearchIcon />
      </NavActionButton>
      <NavActionLink href="/store/cart" label="سبد خرید">
        <BagIcon />
        <Badge count={cartCount} />
      </NavActionLink>
      <ProfileMenu
        user={user}
        isLoading={isLoading}
        onLogout={onLogout}
        logoutPending={logoutPending}
        compact
      />
      <NavActionButton label="باز کردن منو" onClick={onMenuOpen}>
        <MenuIcon />
      </NavActionButton>
    </div>
  );
}
