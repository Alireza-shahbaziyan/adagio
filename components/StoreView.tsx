import Link from "next/link";
import StoreFilters from "@/components/StoreFilters";
import StoreProductGrid from "@/components/StoreProductGrid";
import StorePagination from "@/components/StorePagination";
import { PRODUCTS_PAGE_SIZE, type StoreQueryState } from "@/lib/store";
import type { ProductsResponse } from "@/types/products";
import type { ProductCollection } from "@/types/singleProduct";

export default function StoreView({
  eyebrow,
  title,
  description,
  breadcrumb,
  collections,
  activeCollectionSlug,
  products,
  currentPage,
  queryState,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  breadcrumb: { label: string; href?: string }[];
  collections: ProductCollection[];
  activeCollectionSlug?: string;
  products: ProductsResponse;
  currentPage: number;
  queryState: StoreQueryState;
}) {
  const basePath = activeCollectionSlug
    ? `/store/collection/${activeCollectionSlug}`
    : "/store";
  const totalPages = Math.ceil(products.count / PRODUCTS_PAGE_SIZE);
  const hasActiveFilters = Boolean(
    queryState.search || queryState.featured || activeCollectionSlug,
  );

  return (
    <main>
      <section className="px-5 pb-8 pt-8 md:px-16 md:pt-4 ">
        <nav className="mb-10 text-sm text-neutral-500 ">
          {breadcrumb.map((item, i) => (
            <span key={item.label}>
              {i > 0 && <span className="mx-2">/</span>}
              {item.href ? (
                <Link href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              ) : (
                <span className="text-neutral-300">{item.label}</span>
              )}
            </span>
          ))}
        </nav>

        <div className="mb-12 flex flex-wrap items-end  justify-between gap-6">
          <div>
            <p className="mb-4 text-xs tracking-[1px] text-muted-foreground">
              {eyebrow}
            </p>
            <h1 className="text-[36px] font-black leading-[1.15] text-foreground md:text-[64px]">
              {title}
            </h1>
            {description && (
              <p className="mt-5 max-w-xl leading-8 text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>

        <StoreFilters
          collections={collections}
          activeCollectionSlug={activeCollectionSlug}
          queryState={queryState}
          resultCount={products.count}
        />
      </section>

      <StoreProductGrid
        products={products.results}
        clearFiltersHref={basePath}
        hasActiveFilters={hasActiveFilters}
      />

      <StorePagination
        basePath={basePath}
        currentPage={currentPage}
        totalPages={totalPages}
        queryState={queryState}
      />
    </main>
  );
}
