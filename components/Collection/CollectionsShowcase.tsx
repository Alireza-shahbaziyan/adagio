import Link from "next/link";
import Reveal from "@/components/Reveal";

import { ProductCollection } from "@/types/singleProduct";
import CollectionCard from "./CollectionCard";

export default function CollectionsShowcase({
  collections,
  totalCount,
  startIndex = 0,
  search,
}: {
  collections: ProductCollection[];
  totalCount: number;
  /** Position of `collections[0]` within the full result set — lets the catalog
   * index stay correct once a future pager passes page > 1. */
  startIndex?: number;
  /** Active search term, if any — only used to tailor the empty state copy. */
  search?: string;
}) {
  const trimmedSearch = search?.trim();


  return (
    <section className="mx-auto max-w-350 px-5 pb-24 pt-8 md:px-16 md:pb-40 md:pt-12">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-20">
        <div>
          <p className="mb-4 text-xs tracking-[1px] text-muted-foreground">
            آرشیو
          </p>
          <h1 className="text-[36px] font-black leading-[1.15] text-foreground md:text-[64px]">
           تیشرت هایی به تم موسیقی 
          </h1>
        </div>
        {totalCount > 0 && (
          <p className="text-sm text-muted-foreground">{totalCount} - کالکشن</p>
        )}
      </div>

      {/* A future filter bar (search / ordering / page_size) mounts here,
          above the grid — this section owns only the result presentation. */}

      {collections.length === 0 ? (
        <div className="rounded-[20px] border border-white/8 bg-[#111111] px-8 py-20 text-center">
          <p className="mb-3 text-lg font-bold text-foreground">
            {trimmedSearch
              ? `چیزی برای «${trimmedSearch}» پیدا نشد`
              : "کالکشنی هنوز منتشر نشده است"}
          </p>
          <p className="mb-8 text-sm text-muted-foreground">
            {trimmedSearch
              ? "کلمه‌ی دیگری را امتحان کن یا فیلتر را پاک کن."
              : "به‌زودی برمی‌گردیم."}
          </p>
          {trimmedSearch && (
            <Link
              href="/collections"
              className="inline-block rounded-full border border-white/25 px-7 py-3 text-sm text-foreground 
              transition-colors hover:border-white/60 hover:bg-white/8"
            >
              مشاهده همه کالکشن‌ها
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection, i) => (
            <Reveal
              key={collection.id}
              style={{ transitionDelay: `${Math.min(i, 8) * 70}ms` }}
            >
              <CollectionCard collection={collection} index={startIndex + i} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
