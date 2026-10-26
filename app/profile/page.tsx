import type { Metadata } from "next";

import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileNavBottom/MobileBottomNav";
import ProfileView from "@/components/Profile/ProfileView";
import { frontend } from "@/utils/getURL";

export const metadata: Metadata = {
  title: "پروفایل من | آداجیو",
  description: "اطلاعات حساب کاربری خود را مشاهده و ویرایش کنید.",
  alternates: {
    canonical: `${frontend}/profile`,
  },
};

export default function ProfilePage() {
  return (
    <div
      dir="rtl"
      lang="fa"
      className="relative min-h-screen bg-primary-foreground pb-24 text-white md:pb-0"
    >
      <Navbar variant="default" />
      <ProfileView />
      <Footer mobileBottomPad />
      <MobileBottomNav />
    </div>
  );
}
