"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BagIcon } from "@/components/icons";
import { useQuickAdd } from "@/hooks/useQuickAdd";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/types/products";
import { isVariantInStock } from "@/utils/variant";

export default function QuickAddToCart({ product }: { product: Product }) {
  const {
    canQuickAdd,
    isPending,
    isSizeSheetOpen,
    closeSizeSheet,
    quickAdd,
    addVariant,
  } = useQuickAdd(product);

  if (!canQuickAdd) return null;

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          quickAdd();
        }}
        disabled={isPending}
        aria-label={`افزودن ${product.title} به سبد خرید`}
        className={cn(
          "absolute inset-x-3 bottom-3 z-10",
          "flex h-11 items-center justify-center gap-2",
          "rounded-xl border border-white/10",
          "bg-background/90 text-foreground",
          "text-[13px] font-semibold",
          "shadow-lg shadow-black/10 backdrop-blur-xl",
          "transition-all duration-200",
          "hover:bg-foreground hover:text-background",
          "active:scale-[0.98]",
          "disabled:pointer-events-none disabled:opacity-60",
        )}
      >
        {isPending ? (
          <span
            aria-hidden="true"
            className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        ) : (
          <BagIcon size={16} />
        )}

        {isPending ? "در حال افزودن..." : "افزودن به سبد خرید"}
      </button>

      <Dialog
        open={isSizeSheetOpen}
        onOpenChange={(open) => {
          if (!open) closeSizeSheet();
        }}
      >
        <DialogContent
          dir="rtl"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={cn(
            "fixed left-1/2 top-1/2",
            "-translate-x-1/2 -translate-y-1/2",
            "w-[calc(100%-32px)] max-w-100",
            "max-h-[min(85dvh,560px)] overflow-y-auto",
            "rounded-2xl border border-border/60",
            "bg-background p-5 sm:p-6",
            "shadow-2xl",
            "duration-200 bg-black/65 backdrop-blur-md",
          )}
          // overlayClassName="bg-black/45 backdrop-blur-md"
        >
          <DialogHeader className="space-y-2 text-right">
            <DialogTitle className="text-base font-bold tracking-tight">
              انتخاب سایز
            </DialogTitle>

            <DialogDescription className="line-clamp-2 text-xs leading-6">
              {product.title}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {product.variants.map((variant) => {
              const purchasable = isVariantInStock(variant);
              const disabled = !purchasable || isPending;

              return (
                <button
                  key={variant.id}
                  type="button"
                  disabled={disabled}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addVariant(variant);
                  }}
                  aria-label={
                    purchasable
                      ? `افزودن سایز ${variant.size_name} به سبد خرید`
                      : `${variant.size_name} - ناموجود`
                  }
                  className={cn(
                    "flex min-h-[68px] flex-col",
                    "items-center justify-center gap-1",
                    "rounded-xl border px-3 py-2.5",
                    "transition-all duration-150",
                    purchasable
                      ? [
                          "border-border bg-transparent",
                          "hover:border-foreground/50",
                          "hover:bg-muted/60",
                          "active:scale-[0.97]",
                        ]
                      : [
                          "cursor-not-allowed border-border/40",
                          "bg-muted/30 opacity-45",
                        ],
                    isPending && purchasable && "opacity-50",
                  )}
                >
                  <span
                    dir="ltr"
                    className={cn(
                      "text-sm font-semibold",
                      !purchasable && "line-through",
                    )}
                  >
                    {variant.size_name}
                  </span>

                  <span className="text-[11px] text-muted-foreground">
                    {formatPrice(variant.price)}
                  </span>

                  {!purchasable && (
                    <span className="text-[10px] text-muted-foreground">
                      ناموجود
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
