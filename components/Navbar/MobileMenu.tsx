"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

import { ChevronLeftIcon, CloseIcon } from "@/components/icons";
import { UserAvatar } from "@/components/Profile/UserAvatar";
import { getUserDisplayName, formatUserPhone } from "@/lib/user";
import type { User } from "@/types/auth";
import { NAV_LINKS } from "./navLinks";

interface MobileMenuProps {
  user: User | null;
  isMember: boolean;
  onClose: () => void;
  onLogout: () => void;
  logoutPending: boolean;
}

export function MobileMenu({
  user,
  isMember,
  onClose,
  onLogout,
  logoutPending,
}: MobileMenuProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="منوی اصلی"
      style={{ animation: "fadeInSoft 0.25s ease" }}
      className="fixed inset-0 z-5000 flex flex-col bg-primary-foreground md:hidden"
    >
      <div className="flex shrink-0 items-center justify-between border-b border-white/8 px-5 py-3.5">
        <Link
          href="/"
          onClick={onClose}
          style={{ direction: "ltr" }}
          className="font-instrument-serif text-[26px] italic text-foreground"
        >
          Adagio
        </Link>
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="بستن منو"
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-white/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-[calc(24px+env(safe-area-inset-bottom))] pt-2">
        <nav aria-label="ناوبری اصلی" className="flex flex-col">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="group flex items-center justify-between border-b border-white/8 py-4 text-[20px] font-bold text-foreground transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <span>{link.label}</span>
              <span className="text-muted-foreground transition-transform group-hover:-translate-x-0.5">
                <ChevronLeftIcon size={16} />
              </span>
            </Link>
          ))}
        </nav>

        {isMember && user ? (
          <div className="mt-7 rounded-[20px] border border-white/8 bg-[#111111] p-4">
            <Link
              href="/profile"
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl p-1 transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <UserAvatar user={user} size={44} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-foreground">
                  {getUserDisplayName(user)}
                </span>
                <span
                  dir="ltr"
                  className="mt-0.5 block truncate text-start text-xs text-muted-foreground"
                >
                  {formatUserPhone(user.phone)}
                </span>
              </span>
              <span className="shrink-0 text-muted-foreground">
                <ChevronLeftIcon size={15} />
              </span>
            </Link>

            <button
              type="button"
              onClick={() => {
                onLogout();
                onClose();
              }}
              disabled={logoutPending}
              className="mt-3 w-full rounded-full border border-white/12 px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-white/25 hover:text-foreground disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              {logoutPending ? "در حال خروج…" : "خروج از حساب کاربری"}
            </button>
          </div>
        ) : (
          <div className="mt-7 rounded-[20px] border border-white/8 bg-[#111111] p-5">
            <p className="mb-1.5 text-sm font-bold text-foreground">
              حساب کاربری
            </p>
            <p className="mb-4 text-xs leading-6 text-muted-foreground">
              برای مدیریت سفارش‌ها، آدرس‌ها و پروفایل وارد حساب کاربری‌ات شو.
            </p>
            <Link
              href="/login"
              onClick={onClose}
              className="flex w-full items-center justify-center rounded-full bg-foreground px-4 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              ورود / حساب کاربری
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
