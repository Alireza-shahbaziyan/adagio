"use client";

import Link from "next/link";
import { useOrder } from "@/lib/checkout";
import OrderStatusBadge from "@/components/Orders/OrderStatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function OrderResultClient({ token, initialStatus }: { token: string; initialStatus: "success" | "failed" }) {
  const { data: order, isLoading, isError } = useOrder(token);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-5 pb-20 pt-28 md:px-16 md:pt-40">
        <Skeleton className="mb-8 h-10 w-48 rounded-lg bg-[#181818]" />
        <div className="flex flex-col gap-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-[20px] bg-[#181818]" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="mx-auto max-w-3xl px-5 pb-20 pt-28 text-center md:px-16 md:pt-40">
        <p className="mb-3 text-lg font-bold text-foreground">
          دریافت اطلاعات سفارش ناموفق بود
        </p>
        <p className="mb-8 text-sm text-muted-foreground">
          مشکلی در ارتباط با سرور پیش آمد. لطفاً دوباره تلاش کن.
        </p>
        <Link
          href="/store/orders"
          className="inline-block rounded-full border border-white/25 px-7 py-3 text-sm text-foreground transition-colors hover:border-white/60 hover:bg-white/8"
        >
          مشاهده سفارش‌های من
        </Link>
      </div>
    );
  }

  const isPaid = order.status === "paid";
  const isPendingPayment = order.status === "pending_payment";
  const isCancelled = order.status === "cancelled";
  const isExpired = order.status === "expired";

  const showSuccessUI = isPaid;
  const showFailedUI = isCancelled || isExpired || (isPendingPayment && initialStatus === "failed");

  return (
    <div className="mx-auto max-w-3xl px-5 pb-20 pt-6 md:px-16 md:pt-20">
      <div className="mb-8 flex items-center gap-3">
        <h1 className="text-[28px] font-black leading-[1.15] text-foreground md:text-[44px]">
          سفارش {order.order_number}
        </h1>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="rounded-[20px] border border-white/8 bg-[#111111] p-6 text-center">
        <div
          className={`mx-auto mb-6 flex size-20 items-center justify-center rounded-full border ${
            showSuccessUI
              ? "border-primary/20 bg-primary/5"
              : "border-destructive/20 bg-destructive/5"
          }`}
        >
          {showSuccessUI ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="size-9 text-primary"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="size-9 text-destructive"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          )}
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
          {showSuccessUI ? "پرداخت موفق بود" : "پرداخت ناموفق بود"}
        </h2>

        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-muted-foreground">
          {showSuccessUI
            ? "پرداخت شما با موفقیت انجام شد و سفارش شما ثبت گردید."
            : "متأسفانه در پردازش پرداخت شما مشکلی پیش آمد. لطفاً دوباره تلاش کنید."}
        </p>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs text-muted-foreground">
          <span className={`size-1.5 rounded-full ${showSuccessUI ? "bg-primary" : "bg-destructive"}`} />
          وضعیت: {showSuccessUI ? "موفق" : "ناموفق"}
        </div>

        {showFailedUI && (
          <p className="mt-4 text-xs leading-6 text-muted-foreground">
            در صورت کسر وجه از حساب، مبلغ طبق روال درگاه پرداخت به حساب شما
            بازگردانده خواهد شد. در صورت نیاز با پشتیبانی تماس بگیرید.
          </p>
        )}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {showSuccessUI ? (
            <Link
              href={`/store/orders/${order.token}`}
              className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              مشاهده جزئیات سفارش
            </Link>
          ) : (
            <Link
              href={`/store/orders/${order.token}`}
              className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              تلاش مجدد برای پرداخت
            </Link>
          )}

          <Link
            href="/store/orders"
            className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-card px-6 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            سفارش‌های من
          </Link>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <div className="rounded-[20px] border border-white/8 bg-[#111111] p-5">
          <h2 className="mb-3 text-sm font-bold text-foreground">
            خلاصه سفارش
          </h2>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>مجموع</span>
              <span className="font-bold text-foreground">{formatPrice(order.total_amount)}</span>
            </div>
            <div className="flex justify-between">
              <span>تاریخ ثبت</span>
              <span>{formatDate(order.created_at)}</span>
            </div>
            {order.paid_at && (
              <div className="flex justify-between">
                <span>تاریخ پرداخت</span>
                <span>{formatDate(order.paid_at)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}