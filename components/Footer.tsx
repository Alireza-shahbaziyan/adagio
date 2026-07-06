import Link from "next/link";

export default function Footer({ mobileBottomPad = false }: { mobileBottomPad?: boolean }) {
  return (
    <footer
      className={`border-t border-white/[0.08] px-5 pt-16 md:px-16 md:pt-24 ${
        mobileBottomPad ? "pb-24 md:pb-8" : "pb-8"
      }`}
    >
      <div className="mb-16 grid grid-cols-2 gap-10 md:grid-cols-4">
        <div>
          <p
            style={{ direction: "ltr" }}
            className="mb-4 font-[family-name:var(--font-instrument-serif)] text-[28px] italic text-[#F3F3F3]"
          >
            Adagio
          </p>
          <p className="max-w-[240px] text-sm leading-[1.8] text-[#A8A8A8]">
            طرح‌های تک‌رنگ برای شب‌های دیر و رانندگی‌های طولانی.
          </p>
        </div>
        <div>
          <p className="mb-5 text-[13px] text-[#F3F3F3]">فروشگاه</p>
          <Link href="/#featured" className="mb-3.5 block text-sm text-[#A8A8A8]">
            ویژه
          </Link>
          <Link href="/#categories" className="mb-3.5 block text-sm text-[#A8A8A8]">
            کالکشن مشکی
          </Link>
          <Link href="/#categories" className="block text-sm text-[#A8A8A8]">
            کالکشن سفید
          </Link>
        </div>
        <div>
          <p className="mb-5 text-[13px] text-[#F3F3F3]">درباره ما</p>
          <Link href="/#story" className="mb-3.5 block text-sm text-[#A8A8A8]">
            درباره
          </Link>
          <Link href="/#newsletter" className="block text-sm text-[#A8A8A8]">
            تماس
          </Link>
        </div>
        <div>
          <p className="mb-5 text-[13px] text-[#F3F3F3]">راهنما</p>
          <Link href="#" className="mb-3.5 block text-sm text-[#A8A8A8]">
            ارسال
          </Link>
          <Link href="#" className="block text-sm text-[#A8A8A8]">
            مرجوعی
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-6 border-t border-white/[0.08] pt-8">
        <p className="text-[13px] text-[#5a5a5a]">© ۲۰۲۶ آداجیو. تمامی حقوق محفوظ است.</p>
        <div className="flex gap-3.5">
          {["IG", "TT", "SP"].map((s) => (
            <Link
              key={s}
              href="#"
              className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/[0.15] text-[11px] tracking-[0.5px] text-[#A8A8A8]"
            >
              {s}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
