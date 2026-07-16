import Link from "next/link";

export default function Footer({
  mobileBottomPad = false,
}: {
  mobileBottomPad?: boolean;
}) {
  return (
    <footer
      className={`border-t border-white/8 px-5 pt-16 md:px-16 md:pt-24 ${
        mobileBottomPad ? "pb-24 md:pb-8" : "pb-8"
      }`}
    >
      <div className="mb-16 grid grid-cols-2 gap-10 md:grid-cols-4">
        <div>
          <p
            style={{ direction: "ltr" }}
            className="mb-4 font-instrument-serif text-[28px] italic text-foreground"
          >
            Adagio
          </p>
          <p className="max-w-60 text-sm leading-[1.8] text-muted-foreground">
            موسیقی را به تن کن
          </p>
        </div>
        <div>
          <p className="mb-5 text-[13px] text-foreground">فروشگاه</p>
          <Link
            href="/store#featured"
            className="mb-3.5 block text-sm text-muted-foreground"
          >
            ویژه
          </Link>
        </div>
        <div>
          <p className="mb-5 text-[13px] text-foreground">درباره ما</p>
          <Link
            href="/about"
            className="mb-3.5 block text-sm text-muted-foreground"
          >
            درباره
          </Link>
          <Link
            href="/contact-me"
            className="block text-sm text-muted-foreground"
          >
            تماس
          </Link>
        </div>
        {/* <div>
          <p className="mb-5 text-[13px] text-foreground">راهنما</p>
          <Link href="#" className="mb-3.5 block text-sm text-muted-foreground">
            ارسال
          </Link>
          <Link href="#" className="block text-sm text-muted-foreground">
            مرجوعی
          </Link>
        </div> */}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-6 border-t border-white/8 pt-8">
        <p className="text-[13px] text-[#5a5a5a]">
          © ۲۰۲۶ آداجیو. تمامی حقوق محفوظ است.
        </p>
        <div className="flex gap-3.5">
          {["IG", "TT", "SP"].map((s) => (
            <Link
              key={s}
              href="#"
              className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/[0.15] text-[11px] tracking-[0.5px] text-muted-foreground"
            >
              {s}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
