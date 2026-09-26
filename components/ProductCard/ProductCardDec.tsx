import { ProductVariant } from "@/types/products";
import { formatPrice } from "@/lib/utils";

function ProductCardDec({
  title,
  isvalid,
  variant,
}: {
  isvalid: boolean;
  title: string;
  variant: ProductVariant[];
}) {
  const product = variant[0];

  return (
    <div className="min-h-32 px-1 py-4" dir="rtl">
      {/* Product title */}
      <h3 className="mb-3 text-base font-semibold leading-7 text-foreground">
        {title}
      </h3>

      {/* Previous price */}
      {product.compare_price && (
        <div className="mb-1 flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">قیمت قبل:</span>

          <span className="font-medium text-muted-foreground line-through decoration-red-400/80">
            {formatPrice(product.compare_price)}
          </span>
        </div>
      )}

      {/* Current price */}
      <div className="mt-2 flex items-center justify-between gap-3">
        {isvalid ? (
          <>
            <span className="text-sm text-muted-foreground">
              قیمت:
            </span>

            {product.price && (
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold tracking-tight text-foreground">
                  {formatPrice(product.price)}
                </span>
              </div>
            )}
          </>
        ) : (
          <span className="rounded-md bg-muted px-3 py-1.5 text-sm font-medium text-muted-foreground">
            ناموجود
          </span>
        )}
      </div>
    </div>
  );
}

export default ProductCardDec;