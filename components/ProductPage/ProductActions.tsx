import { HeartIcon } from "@/components/icons";
import type { ProductVariant } from "@/types/products";

export default function ProductActions({
  selectedVariant,
  addToCartPending,
  onAddToCart,
  wishlisted,
  wishlistPending,
  onToggleWishlist,
  onBuyNow,
}: {
  selectedVariant: ProductVariant | undefined;
  addToCartPending: boolean;
  onAddToCart: () => void;
  wishlisted: boolean;
  wishlistPending: boolean;
  onToggleWishlist: () => void;
  onBuyNow: () => void;
}) {
  return (
    <>
      <div className="mb-4 flex flex-wrap gap-3">
        <button
          onClick={onAddToCart}
          disabled={!selectedVariant || addToCartPending}
          style={{
            opacity: selectedVariant ? 1 : 0.5,
            cursor: selectedVariant ? "pointer" : "not-allowed",
          }}
          className="min-w-[180px] flex-1 rounded-full bg-foreground px-7 py-4.5 text-[15px] font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
        >
          افزودن به سبد خرید
        </button>
        <button
          onClick={onToggleWishlist}
          disabled={wishlistPending}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-transparent text-foreground transition-colors hover:bg-white/8 disabled:opacity-50"
        >
          <HeartIcon filled={wishlisted} />
        </button>
      </div>
      <button
        onClick={onBuyNow}
        disabled={!selectedVariant}
        style={{
          opacity: selectedVariant ? 1 : 0.5,
          cursor: selectedVariant ? "pointer" : "not-allowed",
        }}
        className="mb-10 w-full rounded-full border border-white/30 bg-transparent px-7 py-4.5 text-[15px] font-bold text-foreground transition-colors hover:border-white/60 hover:bg-white/8"
      >
        همین حالا بخرید
      </button>
    </>
  );
}
