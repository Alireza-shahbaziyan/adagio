export default function ProductFooter() {
  return (
    <footer className="mx-auto mt-20 max-w-[1400px] border-t border-white/8 px-5 pb-8 pt-12 md:px-16 md:pt-20">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <span
          style={{ direction: "ltr" }}
          className="font-[family-name:var(--font-instrument-serif)] text-[22px] italic text-foreground"
        >
          Adagio
        </span>
        <p className="text-[13px] text-[#5a5a5a]">
          © ۲۰۲۶ آداجیو. تمامی حقوق محفوظ است.
        </p>
      </div>
    </footer>
  );
}
