import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";

interface PageProps {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ status?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps) {
  const { status } = await searchParams;
  if (status === "success") {
    return { title: "پرداخت موفق" };
  }
  return { title: "پرداخت ناموفق" };
}

export default async function PaymentResultPage({ params, searchParams }: PageProps) {
  const { token } = await params;
  const { status } = await searchParams;

  const isSuccess = status === "success";

  return (
    <>
      <Navbar variant="default" />

      <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
        <section className="w-full max-w-md rounded-2xl border border-white/8 bg-[#111111] p-8 text-center">
          {isSuccess ? (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>

              <h1 className="mb-2 text-lg font-bold text-foreground">
                پرداخت با موفقیت انجام شد
              </h1>

              <p className="mb-6 text-sm text-muted-foreground">
                سفارش شما با موفقیت پرداخت شد و در حال پردازش است.
              </p>
            </>
          ) : (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
                <XCircle className="h-8 w-8 text-red-500" />
              </div>

              <h1 className="mb-2 text-lg font-bold text-foreground">
                پرداخت ناموفق بود
              </h1>

              <p className="mb-6 text-sm text-muted-foreground">
                پرداخت شما انجام نشد. در صورت کسر مبلغ از حساب شما، مبلغ ظرف ۷۲ ساعت بازگردانده می‌شود.
              </p>
            </>
          )}

          <div className="flex flex-col gap-3">
            <Link
              href={`/store/orders/${token}`}
              className="inline-block rounded-full border border-white/25 px-7 py-3 text-sm text-foreground transition-colors hover:border-white/60 hover:bg-white/8"
            >
              مشاهده سفارش
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
