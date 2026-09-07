import type { Metadata } from "next";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import CartView from "@/components/CartView";
import { frontend } from "@/utils/getURL";

import CartNavigation from "@/components/Navbar/CartNavigation";

export const metadata: Metadata = {
  title: "سبد خرید | آداجیو",
  description: "محصولات انتخاب‌شده خود را بررسی کنید و سفارش خود را ثبت کنید.",
  alternates: {
    canonical: `${frontend}/cart`,
  },
};

export default function CartPage() {
  return (
    <div
      dir="rtl"
      lang="fa"
      className="relative min-h-screen bg-primary-foreground pb-24 text-white md:pb-0"
    >
      <Navbar variant="default" />
      <h1 className="mb-8 text-[28px] font-black leading-[1.15] text-foreground md:text-6xl md:px-16 w-full text-center pt-4">
        سبد خرید
      </h1>
      <CartNavigation
        items={[{ label: "سفارشات رزرو شده", href: "/orders" }]}
      />
      <CartView />

      <Footer mobileBottomPad />
      <MobileBottomNav />
    </div>
  );
}
