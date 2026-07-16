import type { Metadata } from "next";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import CartView from "@/components/CartView";
import { frontend } from "@/utils/getURL";

export const metadata: Metadata = {
  title: "سبد خرید | آداجیو",
  description: "محصولات داخل سبد خریدت را مرور و مدیریت کن.",
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
      <CartView />
      <Footer mobileBottomPad />
      <MobileBottomNav />
    </div>
  );
}
