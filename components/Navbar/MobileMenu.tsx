"use client";
import Link from "next/link";
import { CloseIcon } from "@/components/icons";
import { logoutResponse } from "@/types/auth";
import { UseMutateFunction } from "@tanstack/react-query";
import { useAppState } from "@/lib/app-state";

const NAV_LINKS = [
  { href: "/store", label: "فروشگاه" },
  { href: "/blog", label: "بلاگ" },
  { href: "/store/collections", label: "کالکشن‌ها" },
  { href: "/store/categories", label: "دستبه‌بندی" },
  { href: "/store/order-guide", label: "راهنمای‌خرید" },
  { href: "/about", label: "درباره" },
  { href: "/contact-me", label: "تماس" },
];

interface MobileMenuProps {
  isMember: boolean;
  onClose: () => void;
  logout: UseMutateFunction<logoutResponse, Error, void, unknown>;
}

export function MobileMenu({ isMember, onClose, logout }: MobileMenuProps) {
  const { showToast } = useAppState();
  function handleLogoutButton() {
    logout(undefined, {
      onSuccess: () => {
        showToast("شما با موفقیت خارج شدید");
        onClose();
      },
      onError: () => {
        showToast("با خطا مواجه شد خروج شما");
      },
    });
  }
  return (
    <div
      style={{ animation: "fadeInSoft 0.3s ease" }}
      className="fixed inset-0 z-5000 flex flex-col bg-primary-foreground p-6 md:hidden"
    >
      <div className="mb-12 flex items-center justify-between">
        <span
          style={{ direction: "ltr" }}
          className="font-instrument-serif text-[26px] italic text-foreground"
        >
          Adagio
        </span>
        <button
          onClick={onClose}
          className="flex p-2 text-foreground"
          type="button"
        >
          <CloseIcon />
        </button>
      </div>
      {NAV_LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          onClick={onClose}
          className="border-b border-white/8 py-4.5 text-[28px] font-bold text-foreground"
        >
          {l.label}
        </Link>
      ))}
      {isMember ? (
        <button
          type="button"
          onClick={handleLogoutButton}
          className="w-fit border-b border-white pb-2 pt-6 text-base text-muted-foreground hover:text-primary focus:border-muted-foreground focus:text-white"
        >
          خروج از حساب کاربری
        </button>
      ) : (
        <Link
          href="/login"
          onClick={onClose}
          className="w-fit border-b border-white pb-2 pt-6 text-base text-muted-foreground hover:text-primary focus:border-muted-foreground focus:text-white"
        >
          ورود / حساب کاربری
        </Link>
      )}
    </div>
  );
}
