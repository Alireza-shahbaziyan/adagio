import Link from "next/link";
import type { ProductVariant } from "@/types/products";

export default function ProductSizeSelector({
  variants,
  selectedSize,
  onSelectSize,
}: {
  variants: ProductVariant[];
  selectedSize: ProductVariant["size_name"] | null;
  onSelectSize: (size: ProductVariant["size_name"]) => void;
}) {
  if (variants.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="mb-3.5 flex items-center justify-between">
        <span className="text-[13px] text-foreground">سایز</span>
        <Link href="#" className="text-[13px] text-muted-foreground underline">
          راهنمای سایز
        </Link>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {variants.map((variant) => {
          const active = selectedSize === variant.size_name;
          const disabled = !variant.is_active || variant.stock <= 0;
          return (
            <button
              key={variant.id}
              disabled={disabled}
              onClick={() => onSelectSize(variant.size_name)}
              style={{
                direction: "ltr",
                background: active ? "#F3F3F3" : "transparent",
                color: active ? "#090909" : disabled ? "#4a4a4a" : "#F3F3F3",
                borderColor: active ? "#F3F3F3" : "rgba(255,255,255,0.25)",
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? "not-allowed" : "pointer",
              }}
              className="min-w-12 rounded-full border px-4 py-3 text-sm transition-colors"
            >
              {variant.size_name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
