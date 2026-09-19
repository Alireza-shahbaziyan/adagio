import { Suspense } from "react";
import Navbar from "../Navbar/Navbar";
import { Skeleton } from "../ui/skeleton";
import Footer from "../Footer";
import MobileBottomNav from "../MobileNavBottom/MobileBottomNav";
import OrdersContent from "./OrdersContent";

export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <div
          dir="rtl"
          lang="fa"
          className="relative min-h-screen bg-primary-foreground pb-24 text-white md:pb-0"
        >
          <Navbar variant="default" />
          <div className="mx-auto max-w-3xl px-5 pb-20 pt-28 md:px-16 md:pt-40">
            <Skeleton className="mb-8 h-10 w-48 rounded-lg bg-[#181818]" />
            <div className="flex flex-col gap-4">
              {[0, 1, 2].map((i) => (
                <Skeleton
                  key={i}
                  className="h-24 w-full rounded-[20px] bg-[#181818]"
                />
              ))}
            </div>
          </div>
          <Footer mobileBottomPad />
          <MobileBottomNav />
        </div>
      }
    >
      <OrdersContent />
    </Suspense>
  );
}
