import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export const metadata = {
  title: "خطا در پرداخت",
};

export default async function PaymentErrorPage() {
  return (
    <>
      <Navbar variant="default" />

      <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
        <section className="w-full max-w-md rounded-2xl border border-white/8 bg-[#111111] p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>

          <h1 className="mb-2 text-lg font-bold text-foreground">
            خطایی رخ داد
          </h1>

          <p className="mb-6 text-sm text-muted-foreground">
            متأسفانه در پردازش پرداخت مشکلی پیش آمد. لطفاً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/store/orders"
              className="inline-block rounded-full border border-white/25 px-7 py-3 text-sm text-foreground transition-colors hover:border-white/60 hover:bg-white/8"
            >
              مشاهده سفارش‌ها
            </Link>

            <Link
              href="/store"
              className="inline-block text-sm text-muted-foreground underline-offset-2 hover:underline"
            >
              بازگشت به فروشگاه
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
