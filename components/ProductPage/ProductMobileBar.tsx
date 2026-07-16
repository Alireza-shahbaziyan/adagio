import { HeartIcon } from "@/components/icons";
import type { ProductVariant } from "@/types/products";

export default function ProductMobileBar({
  wishlisted,
  wishlistPending,
  onToggleWishlist,
  selectedVariant,
  addToCartPending,
  onAddToCart,
}: {
  wishlisted: boolean;
  wishlistPending: boolean;
  onToggleWishlist: () => void;
  selectedVariant: ProductVariant | undefined;
  addToCartPending: boolean;
  onAddToCart: () => void;
}) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[1000] flex gap-3 border-t border-white/8 bg-[#111111]/95 px-4 backdrop-blur-xl md:hidden"
      style={{
        paddingTop: 12,
        paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
      }}
    >
      <button
        onClick={onToggleWishlist}
        disabled={wishlistPending}
        className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-white/20 bg-transparent text-foreground disabled:opacity-50"
      >
        <HeartIcon size={18} filled={wishlisted} />
      </button>
      <button
        onClick={onAddToCart}
        disabled={!selectedVariant || addToCartPending}
        style={{
          opacity: selectedVariant ? 1 : 0.5,
          cursor: selectedVariant ? "pointer" : "not-allowed",
        }}
        className="flex-1 rounded-full bg-foreground text-[15px] font-bold text-primary-foreground"
      >
        افزودن به سبد ·{" "}
        {selectedVariant ? `$${selectedVariant.price}` : "ناموجود"}
      </button>
    </div>
  );
}
