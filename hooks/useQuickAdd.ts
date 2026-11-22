"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiClientError } from "@/lib/api-client";
import { useAddCartItem } from "@/lib/cart";
import { useAppState } from "@/lib/app-state";
import type { Product, ProductVariant } from "@/types/products";
import {
  getPurchasableVariants,
  isVariantInStock,
} from "@/utils/variant";

const DEFAULT_QUANTITY = 1;

/**
 * Quick add-to-cart flow used by product cards so customers can add an
 * available product without opening the product detail page.
 *
 * - A product with a single purchasable variant is added directly.
 * - A product with several purchasable variants opens the size picker instead.
 * - A product without a valid purchasable SKU is never submitted.
 */
export function useQuickAdd(product: Product) {
  const router = useRouter();
  const { showToast } = useAppState();
  const addCartItem = useAddCartItem();
  const [isSizeSheetOpen, setSizeSheetOpen] = useState(false);

  const purchasableVariants = useMemo(
    () => getPurchasableVariants(product.variants),
    [product.variants],
  );

  const addVariant = useCallback(
    (variant: ProductVariant | undefined) => {
      // Ignore duplicate taps while a submission is already in flight.
      if (addCartItem.isPending) return;

      // Never add a product without a valid purchasable SKU.
      if (!variant || !variant.sku || !isVariantInStock(variant)) {
        showToast("این محصول موجود نیست");
        return;
      }

      const quantity = Math.max(
        1,
        Math.min(DEFAULT_QUANTITY, variant.stock),
      );

      addCartItem.mutate(
        { sku: variant.sku, quantity },
        {
          onSuccess: () => {
            setSizeSheetOpen(false);
            showToast(
              `${quantity} عدد اضافه شد — ${product.title}، سایز ${variant.size_name}`,
            );
          },
          onError: (error) => {
            if (
              error instanceof ApiClientError &&
              [400, 404, 409].includes(error.status)
            ) {
              showToast(
                error.message ||
                  "موجودی این محصول تغییر کرده است. لطفاً دوباره تلاش کن.",
              );
              // Refresh server data so the cards show the fresh stock.
              router.refresh();
              return;
            }

            showToast(
              error instanceof Error
                ? error.message
                : "افزودن به سبد خرید ناموفق بود",
            );
          },
        },
      );
    },
    [addCartItem, product.title, router, showToast],
  );

  /** Single tap on the card: straight to cart when the choice is unambiguous. */
  const quickAdd = useCallback(() => {
    if (addCartItem.isPending) return;

    if (purchasableVariants.length === 0) {
      showToast("این محصول موجود نیست");
      return;
    }

    if (purchasableVariants.length === 1) {
      addVariant(purchasableVariants[0]);
      return;
    }

    setSizeSheetOpen(true);
  }, [addCartItem.isPending, purchasableVariants, addVariant, showToast]);

  return {
    purchasableVariants,
    canQuickAdd: purchasableVariants.length > 0,
    isPending: addCartItem.isPending,
    isSizeSheetOpen,
    openSizeSheet: () => setSizeSheetOpen(true),
    closeSizeSheet: () => setSizeSheetOpen(false),
    quickAdd,
    addVariant,
  };
}
