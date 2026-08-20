import { ProductVariant } from "@/types/products";
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
    <div className="px-1 py-5 min-h-32">
      <p className="mb-1 text-foreground text-lg font-semibold">{title}</p>
      <div className="flex items-center gap-2">
        <p className="text-muted-foreground text-sm py-2 px-3 ">
          {isvalid ? "قیمت از" : "ناموجود"}
        </p>
        {isvalid && (
          <p className="text-muted-foreground text-base">
            {variant[0].price.toLocaleString("fa-IR")} تومان
          </p>
        )}
      </div>
    </div>
  );
}

export default ProductCardDec;
