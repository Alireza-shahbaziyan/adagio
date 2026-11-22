import { describe, expect, it } from "vitest";

import type { ProductVariant } from "@/types/products";
import {
  findFirstAvailableVariant,
  getPurchasableVariants,
  isVariantInStock,
} from "@/utils/variant";

function makeVariant(
  overrides: Partial<ProductVariant> = {},
): ProductVariant {
  return {
    id: 1,
    sku: "SKU-1",
    size: null,
    size_name: "M",
    price: 1000,
    compare_price: null,
    stock: 3,
    is_active: true,
    ...overrides,
  };
}

describe("isVariantInStock", () => {
  it("requires both stock and an active variant", () => {
    expect(isVariantInStock(makeVariant())).toBe(true);
    expect(isVariantInStock(makeVariant({ stock: 0 }))).toBe(false);
    expect(isVariantInStock(makeVariant({ is_active: false }))).toBe(false);
    expect(isVariantInStock(null)).toBe(false);
    expect(isVariantInStock(undefined)).toBe(false);
  });
});

describe("getPurchasableVariants", () => {
  it("keeps only variants that can be bought right now", () => {
    const variants = [
      makeVariant({ id: 1, sku: "A", size_name: "S", stock: 2 }),
      makeVariant({ id: 2, sku: "B", size_name: "M", stock: 0 }),
      makeVariant({ id: 3, sku: "C", size_name: "L", is_active: false }),
      makeVariant({ id: 4, sku: "D", size_name: "XL", stock: 1 }),
    ];

    expect(
      getPurchasableVariants(variants).map((variant) => variant.sku),
    ).toEqual(["A", "D"]);
  });

  it("returns an empty list for missing variants", () => {
    expect(getPurchasableVariants(null)).toEqual([]);
    expect(getPurchasableVariants(undefined)).toEqual([]);
    expect(getPurchasableVariants([])).toEqual([]);
  });
});

describe("findFirstAvailableVariant", () => {
  it("finds the first purchasable variant", () => {
    const variants = [
      makeVariant({ id: 1, sku: "A", stock: 0 }),
      makeVariant({ id: 2, sku: "B", stock: 5 }),
      makeVariant({ id: 3, sku: "C", stock: 1 }),
    ];

    expect(findFirstAvailableVariant(variants)?.sku).toBe("B");
  });
});
