import Link from "next/link";
import Reveal from "@/components/Reveal";
import { ChevronLeftIcon } from "@/components/icons";
import { ProductCollection } from "@/types/singleProduct";

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
    <section className="mx-auto max-w-[1400px] px-5 pb-24 pt-8 md:px-16 md:pb-40 md:pt-12">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-20">
        <div>
          <p className="mb-4 text-xs tracking-[1px] text-[#A8A8A8]">آرشیو</p>
          <h1 className="text-[36px] font-black leading-[1.15] text-[#F3F3F3] md:text-[64px]">
            کالکشن‌ها
          </h1>
        </div>
        {totalCount > 0 && (
          <p style={{ direction: "ltr" }} className="text-sm text-[#A8A8A8]">
            {totalCount} کالکشن
          </p>
        )}
      </div>

      {/* A future filter bar (search / ordering / page_size) mounts here,
          above the grid — this section owns only the result presentation. */}

      {collections.length === 0 ? (
        <div className="rounded-[20px] border border-white/[0.08] bg-[#111111] px-8 py-20 text-center">
          <p className="mb-3 text-lg font-bold text-[#F3F3F3]">
            {trimmedSearch
              ? `چیزی برای «${trimmedSearch}» پیدا نشد`
              : "کالکشنی هنوز منتشر نشده است"}
          </p>
          <p className="mb-8 text-sm text-[#A8A8A8]">
            {trimmedSearch
              ? "کلمه‌ی دیگری را امتحان کن یا فیلتر را پاک کن."
              : "به‌زودی برمی‌گردیم."}
          </p>
          {trimmedSearch && (
            <Link
              href="/collections"
              className="inline-block rounded-full border border-white/25 px-7 py-3 text-sm text-[#F3F3F3] transition-colors hover:border-white/60 hover:bg-white/[0.08]"
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

function CollectionCard({
  collection,
  index,
}: {
  collection: ProductCollection;
  index: number;
}) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[20px] border border-white/[0.06] bg-[#181818] p-8 transition-all duration-500 ease-[cubic-bezier(.16,.8,.24,1)] hover:-translate-y-1.5 hover:border-white/[0.16] hover:shadow-[0_24px_60px_rgba(0,0,0,0.35)] md:p-9"
    >
      <span
        style={{ direction: "ltr" }}
        className="font-instrument-serif mb-6 block text-lg italic text-[#6b6b6b] transition-colors duration-500 group-hover:text-[#A8A8A8]"
      >
        A{index + 1}
      </span>

      <h2 className="mb-3 text-[26px] font-black leading-[1.25] text-[#F3F3F3] md:text-[30px]">
        {collection.title}
      </h2>

      {collection.short_description && (
        <p className="mb-8 line-clamp-2 max-w-[36ch] text-[14px] leading-[1.8] text-[#A8A8A8]">
          {collection.short_description}
        </p>
      )}

      <div className="mt-auto">
        <div className="relative h-px w-full bg-white/[0.1]">
          <span className="absolute inset-y-0 right-0 w-0 bg-[#F3F3F3] transition-all duration-500 ease-out group-hover:w-full" />
        </div>
        <div className="mt-5 flex items-center justify-between">
          <span className="eq-bars opacity-0 transition-opacity duration-300 group-hover:opacity-100 [&>span]:bg-[#F3F3F3]">
            <span />
            <span />
            <span />
            <span />
          </span>
          <span className="flex items-center gap-2 text-[13px] text-[#F3F3F3]">
            مشاهده کالکشن
            <ChevronLeftIcon size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
