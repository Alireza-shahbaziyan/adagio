import type { Metadata } from "next";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import WishlistView from "@/components/Wishlist/WishlistView";
import { frontend } from "@/utils/getURL";

export const metadata: Metadata = {
  title: "علاقه‌مندی‌ها | آداجیو",
  description: "محصولاتی که به علاقه‌مندی‌هایت اضافه کرده‌ای را مرور کن.",
  alternates: {
    canonical: `${frontend}/wishlist`,
  },
};

export default function WishlistPage() {
  return (
    <div
      dir="rtl"
      lang="fa"
      className="relative min-h-screen bg-primary-foreground pb-24 text-white md:pb-0"
    >
      <Navbar variant="default" />
      <WishlistView />
      <Footer mobileBottomPad />
      <MobileBottomNav />
    </div>
  );
}
