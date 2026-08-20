import { ProductVariant } from "@/types/products";

function checkAvailable(variant: ProductVariant[]): boolean {
  for (const item of variant) {
    if (item.is_active && item.stock > 0) {
      return false;
    }
  }
  return true;
}

export default checkAvailable;