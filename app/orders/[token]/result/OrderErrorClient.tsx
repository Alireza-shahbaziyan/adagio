"use client";

import Link from "next/link";

export default function OrderErrorClient() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <section className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full border border-destructive/20 bg-destructive/5">
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
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          خطا در پرداخت
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-muted-foreground">
          در پردازش پرداخت شما مشکلی پیش آمد. لطفاً دوباره تلاش کنید یا با
          پشتیبانی تماس بگیرید.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-destructive" />
          وضعیت: خطا
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/store/cart"
            className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            بازگشت به سبد خرید
          </Link>

          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-card px-6 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </section>
    </main>
  );
}