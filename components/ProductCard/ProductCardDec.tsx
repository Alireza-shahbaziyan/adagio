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
  
  return (
    <div className="min-w-0 px-1 py-5 min-h-32">
      <p className="mb-1 text-foreground text-lg font-semibold break-words whitespace-normal [overflow-wrap:anywhere]">
        {title}
      </p>
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <p className="text-muted-foreground text-sm py-2 px-3 ">
          {isvalid ? "قیمت از" : "ناموجود"}
        </p>
        {isvalid && variant[0].price && (
          <p className="text-muted-foreground text-base break-words">
            {formatPrice(variant[0].price)}
          </p>
        )}
      </div>
    </div>
  );
}

export default ProductCardDec;
