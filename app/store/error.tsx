"use client";

import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function StoreErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="bg-light-in-dark flex min-h-screen items-center justify-center px-6">
      <section className="max-w-xl text-center">
        <p className="text-xs uppercase tracking-[0.45em] text-white/40">
          Unexpected Error
        </p>

        <h1 className="mt-6 text-5xl font-light text-white md:text-7xl">
          فروشگاه بارگذاری نشد.
        </h1>

        <p className="mx-auto mt-8 max-w-md leading-8 text-white/50">
          مشکلی در بارگذاری محصولات پیش آمد. لطفاً دوباره تلاش کن.
        </p>

        <button
          onClick={reset}
          className="mt-12 border border-white/20 px-8 py-4 text-sm tracking-wide text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-black"
        >
          تلاش دوباره
        </button>
      </section>
    </main>
  );
}
