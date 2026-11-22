import type { Dispatch, SetStateAction } from "react";

export default function ProductQuantityStepper({
  qty,
  maxQty,
  setQty,
}: {
  qty: number;
  maxQty: number;
  setQty: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div className="mb-7 flex items-center gap-4">
      <span className="text-[13px] text-foreground">تعداد</span>
      <div className="flex items-center overflow-hidden rounded-full border border-white/15">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          disabled={qty <= 1}
          aria-label="کاهش تعداد"
          className="flex h-11 w-11 items-center justify-center bg-transparent text-lg text-foreground transition-opacity disabled:opacity-40"
        >
          −
        </button>
        <span
          aria-live="polite"
          className="w-8 text-center text-[15px] text-foreground"
        >
          {qty}
        </span>
        <button
          type="button"
          onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
          disabled={qty >= maxQty}
          aria-label="افزایش تعداد"
          className="flex h-11 w-11 items-center justify-center bg-transparent text-lg text-foreground transition-opacity disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  );
}
