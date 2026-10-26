import type { ProductVariant } from "@/types/products";

/** A variant can be bought only when it is active and has stock left. */
export function isVariantInStock(
  variant: Pick<ProductVariant, "is_active" | "stock"> | null | undefined,
): boolean {
  return Boolean(variant && variant.is_active && variant.stock > 0);
}

/** First purchasable variant, used for the product page's initial size. */
export function findFirstAvailableVariant(
  variants: ProductVariant[] | null | undefined,
): ProductVariant | undefined {
  return variants?.find(isVariantInStock);
}
