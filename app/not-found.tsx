"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-light-in-dark flex min-h-screen items-center justify-center px-6">
      <section className="max-w-xl text-center">
        <p className="text- uppercase tracking-[0.45em] text-white/40 font-instrument-serif">
          Error 404
        </p>

        <h1 className="mt-6 text-6xl  tracking-tight text-white md:text-8xl font-nastaliq">
        در تاریکی گم شده.

        </h1>

        <p className="mx-auto mt-8 max-w-md  leading-8 text-white/50">
          صفحه‌ای که به دنبال آن هستید وجود ندارد یا منتقل شده است. بیایید شما را به خانه برگردانیم.
        </p>

        <Link
          href="/"
          className="mt-12 inline-flex font-bold border border-white/20 px-8 py-4 text-sm tracking-wide text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-black"
        >
          بازگشت به خانه
        </Link>
      </section>
    </main>
  );
}