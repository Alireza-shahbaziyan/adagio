import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar/Navbar";
import OrderCheckout from "@/components/Orders/OrderCheckout";
import { frontend } from "@/utils/getURL";
import { cookies } from "next/headers";
import type { Order } from "@/types/checkout";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

async function getOrder(token: string): Promise<Order | null> {
  const cookieStore = await cookies();

  const res = await fetch(`${frontend}/api/orders/${token}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function Page({ params }: PageProps) {
  const { token } = await params;

  const order = await getOrder(token);

  if (!order) {
    return (
      <>
        <Navbar variant="default" />

        <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
          <section className="w-full max-w-2xl rounded-2xl border border-white/8 bg-[#111111] p-8 text-center">
            <h1 className="mb-2 text-lg font-bold text-foreground">
              سفارش پیدا نشد
            </h1>

            <p className="text-sm text-muted-foreground">
              سفارش موردنظر وجود ندارد یا دسترسی به آن امکان‌پذیر نیست.
            </p>

            <Link
              href="/store"
              className="mt-6 inline-block rounded-full border border-white/25 px-7 py-3 text-sm text-foreground transition-colors hover:border-white/60 hover:bg-white/8"
            >
              بازگشت به فروشگاه
            </Link>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar variant="default" />

      <main className="min-h-[70vh] px-4 py-10 sm:py-16">
        <OrderCheckout token={token} />
      </main>

      <Footer />
    </>
  );
}
