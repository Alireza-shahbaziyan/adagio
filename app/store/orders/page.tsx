"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useMembership } from "@/hooks/useMembership";
import { useOrders } from "@/lib/checkout";
import OrderStatusBadge from "@/components/Orders/OrderStatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { OrderStatus } from "@/types/checkout";

const ORDER_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: "pending_payment", label: "در انتظار پرداخت" },
  { value: "paid", label: "پرداخت شده" },
  { value: "cancelled", label: "لغو شده" },
  { value: "expired", label: "منقضی شده" },
];

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function StatusFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeStatus = searchParams.get("status") ?? "";

  function handleStatusChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("status", value);
    } else {
      params.delete("status");
    }
    params.delete("page");
    router.push(`?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
      <button
        type="button"
        onClick={() => handleStatusChange("")}
        className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
          activeStatus === ""
            ? "border-foreground/40 bg-foreground/10 text-foreground"
            : "border-white/10 text-muted-foreground hover:border-white/25 hover:text-foreground"
        }`}
      >
        همه
      </button>
      {ORDER_STATUSES.map((s) => (
        <button
          key={s.value}
          type="button"
          onClick={() => handleStatusChange(s.value)}
          className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
            activeStatus === s.value
              ? "border-foreground/40 bg-foreground/10 text-foreground"
              : "border-white/10 text-muted-foreground hover:border-white/25 hover:text-foreground"
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

function OrdersContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? undefined;
  const { isMember, isLoading: memberLoading } = useMembership();
  const { data, isLoading, isError, refetch } = useOrders(status);

  if (memberLoading) {
    return (
      <div
        dir="rtl"
        lang="fa"
        className="relative min-h-screen bg-primary-foreground pb-24 text-white md:pb-0"
      >
        <Navbar variant="default" />
        <div className="mx-auto max-w-3xl px-5 pb-20 pt-28 md:px-16 md:pt-40">
          <Skeleton className="mb-8 h-10 w-48 rounded-lg bg-[#181818]" />
          <div className="flex gap-2 mb-6">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full bg-[#181818]" />
            ))}
          </div>
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
    );
  }

  if (!isMember) {
    return (
      <div
        dir="rtl"
        lang="fa"
        className="relative min-h-screen bg-primary-foreground pb-24 text-white md:pb-0"
      >
        <Navbar variant="default" />
        <div className="mx-auto max-w-3xl px-5 pb-20 pt-28 text-center md:px-16 md:pt-40">
          <p className="mb-3 text-lg font-bold text-foreground">
            برای مشاهده سفارش‌ها وارد شو
          </p>
          <p className="mb-8 text-sm text-muted-foreground">
            برای مشاهده سفارش‌های خود، ابتدا وارد حساب کاربری‌ات شو.
          </p>
          <Link
            href="/login"
            className="inline-block rounded-full border border-white/25 px-7 py-3 text-sm text-foreground transition-colors hover:border-white/60 hover:bg-white/8"
          >
            ورود به حساب کاربری
          </Link>
        </div>
        <Footer mobileBottomPad />
        <MobileBottomNav />
      </div>
    );
  }

  const orders = data?.results ?? [];

  return (
    <div
      dir="rtl"
      lang="fa"
      className="relative min-h-screen bg-primary-foreground pb-24 text-white md:pb-0"
    >
      <Navbar variant="default" />
      <div className="mx-auto max-w-3xl px-5 pb-20 pt-6 md:px-16 md:pt-20">
        <h1 className="mb-8 text-[28px] font-black leading-[1.15] text-foreground md:text-[44px]">
          سفارش‌های من
        </h1>

        <Suspense
          fallback={
            <div className="mb-6 flex gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full bg-[#181818]" />
              ))}
            </div>
          }
        >
          <StatusFilters />
        </Suspense>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[0, 1, 2].map((i) => (
              <Skeleton
                key={i}
                className="h-24 w-full rounded-[20px] bg-[#181818]"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-[20px] border border-white/8 bg-[#111111] px-8 py-20 text-center">
            <p className="mb-3 text-lg font-bold text-foreground">
              دریافت سفارش‌ها ناموفق بود
            </p>
            <p className="mb-8 text-sm text-muted-foreground">
              مشکلی در ارتباط با سرور پیش آمد. لطفاً دوباره تلاش کن.
            </p>
            <Button onClick={() => refetch()}>تلاش دوباره</Button>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-[20px] border border-white/8 bg-[#111111] px-8 py-20 text-center">
            <p className="mb-3 text-lg font-bold text-foreground">
              {status ? "سفارشی با این وضعیت یافت نشد" : "سفارشی ثبت نشده"}
            </p>
            <p className="mb-8 text-sm text-muted-foreground">
              {status
                ? "سفارش دیگری با این فیلتر وجود ندارد."
                : "هنوز سفارشی ثبت نکرده‌اید."}
            </p>
            <Link
              href="/store"
              className="inline-block rounded-full border border-white/25 px-7 py-3 text-sm text-foreground transition-colors hover:border-white/60 hover:bg-white/8"
            >
              رفتن به فروشگاه
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <Link
                key={order.token}
                href={`/store/orders/${order.token}`}
                className="block rounded-[20px] border border-white/8 bg-[#111111] p-5 transition-colors hover:border-white/20"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-foreground">
                      سفارش {order.order_number}
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <span
                    style={{ direction: "ltr" }}
                    className="text-sm font-bold text-foreground"
                  >
                    ${order.total_amount}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatDate(order.created_at)}</span>
                  <span>{order.items?.length ?? 0} آیتم</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer mobileBottomPad />
      <MobileBottomNav />
    </div>
  );
}

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
