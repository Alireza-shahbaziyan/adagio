"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, UserIcon } from "@/components/icons";
import { UserAvatar } from "@/components/Profile/UserAvatar";
import { getUserDisplayName, formatUserPhone } from "@/lib/user";
import type { User } from "@/types/auth";
import { NavActionLink } from "./NavAction";

interface ProfileMenuProps {
  user: User | null;
  isLoading: boolean;
  onLogout: () => void;
  logoutPending?: boolean;
  compact?: boolean;
}

export function ProfileMenu({
  user,
  isLoading,
  onLogout,
  logoutPending = false,
  compact = false,
}: ProfileMenuProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (isLoading) {
    return (
      <span
        aria-hidden="true"
        className="inline-flex h-10 w-10 items-center justify-center"
      >
        <span className="h-8 w-8 animate-pulse rounded-full bg-white/10" />
      </span>
    );
  }

  if (!user) {
    return (
      <NavActionLink href="/login" label="ورود به حساب کاربری">
        <UserIcon />
      </NavActionLink>
    );
  }

  const displayName = getUserDisplayName(user);
  const phone = formatUserPhone(user.phone);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        openOnHover
        delay={120}
        closeDelay={180}
        aria-label={`حساب کاربری ${displayName}`}
        className="group flex h-10 items-center gap-2 rounded-full border border-transparent px-1.5 text-foreground transition-colors hover:border-white/12 hover:bg-white/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 data-[popup-open]:border-white/12 data-[popup-open]:bg-white/8"
      >
        {!compact && (
          <span className="hidden max-w-28 truncate text-sm xl:block">
            {displayName}
          </span>
        )}
        <UserAvatar user={user} size={compact ? 27 : 30} />
        {!compact && (
          <span className="hidden text-muted-foreground transition-transform group-data-[popup-open]:rotate-180 sm:block">
            <ChevronDownIcon size={13} />
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-64 min-w-0 p-1.5"
      >
        <div className="flex items-center gap-3 rounded-md px-2 py-2.5">
          <UserAvatar user={user} size={38} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {displayName}
            </p>
            {phone && (
              <p
                dir="ltr"
                className="mt-0.5 truncate text-start text-xs text-muted-foreground"
              >
                {phone}
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          render={<Link href="/profile" />}
          className="cursor-pointer px-2 py-2"
        >
          <UserIcon size={16} />
          مشاهده پروفایل
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          disabled={logoutPending}
          onClick={() => {
            setOpen(false);
            onLogout();
          }}
          className="cursor-pointer px-2 py-2"
        >
          <LogOut />
          {logoutPending ? "در حال خروج…" : "خروج از حساب کاربری"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
