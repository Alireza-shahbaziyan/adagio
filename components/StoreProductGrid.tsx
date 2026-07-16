import Link from "next/link";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/products";

export default function StoreProductGrid({
  products,
  clearFiltersHref,
  hasActiveFilters,
}: {
  products: Product[];
  clearFiltersHref: string;
  hasActiveFilters: boolean;
}) {
  return (
    <section
      id="featured"
      className="scroll-mt-24 px-5 pb-20 pt-10 md:px-16 md:pb-32"
    >
      {products.length === 0 ? (
        <div className="rounded-[20px] border border-white/8 bg-[#111111] px-8 py-20 text-center">
          <p className="mb-3 text-lg font-bold text-foreground">
            {hasActiveFilters
              ? "محصولی با این فیلترها پیدا نشد"
              : "محصولی هنوز منتشر نشده است"}
          </p>
          <p className="mb-8 text-sm text-muted-foreground">
            {hasActiveFilters
              ? "فیلتر دیگری را امتحان کن یا همه را پاک کن."
              : "به‌زودی برمی‌گردیم."}
          </p>
          {hasActiveFilters && (
            <Link
              href={clearFiltersHref}
              className="inline-block rounded-full border border-white/25 px-7 py-3 text-sm text-foreground transition-colors hover:border-white/60 hover:bg-white/8"
            >
              پاک‌کردن فیلترها
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <Reveal
              key={product.id}
              style={{ transitionDelay: `${Math.min(i, 8) * 60}ms` }}
            >
              <ProductCard product={product} interactive priority={i === 0} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
