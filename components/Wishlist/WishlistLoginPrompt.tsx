import Link from "next/link";

export default function WishlistLoginPrompt() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-20 pt-28 md:px-16 md:pt-40">
      <div className="rounded-[20px] border border-white/8 bg-[#111111] px-8 py-20 text-center">
        <p className="mb-3 text-lg font-bold text-foreground">
          برای دیدن علاقه‌مندی‌ها وارد شو
        </p>
        <p className="mb-8 text-sm text-muted-foreground">
          برای ذخیره و مشاهده محصولات مورد علاقه‌ات ابتدا وارد حساب کاربری‌ات
          شو.
        </p>
        <Link
          href="/login"
          className="inline-block rounded-full border border-white/25 px-7 py-3 text-sm text-foreground transition-colors hover:border-white/60 hover:bg-white/8"
        >
          ورود به حساب کاربری
        </Link>
      </div>
    </div>
  );
}
