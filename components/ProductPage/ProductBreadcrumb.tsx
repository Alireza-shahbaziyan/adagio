import Link from "next/link";
import type { ProductCollection } from "@/types/singleProduct";

export default function ProductBreadcrumb({
  collections,
  productTitle,
}: {
  collections: ProductCollection[];
  productTitle: string;
}) {
  const primaryCollection = collections?.[0];

  return (
    <div className="mb-10 flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground md:mb-14">
      <Link href="/" className="text-muted-foreground">
        خانه
      </Link>
      <span>/</span>
      <Link href="/store" className="text-muted-foreground">
        فروشگاه
      </Link>
      <span>/</span>
      <Link
        href={`/store/collections/${collections[0].slug}`}
        className="text-muted-foreground"
      >
        {primaryCollection?.title ?? "محصولات"}
      </Link>
      <span>/</span>
      <span className="text-foreground">{productTitle}</span>
    </div>
  );
}
