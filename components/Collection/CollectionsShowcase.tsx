import Link from "next/link";
import Reveal from "@/components/Reveal";

import { ProductCollection } from "@/types/singleProduct";
import CollectionCard from "./CollectionCard";
import Image from "next/image";
import AdagioGirl from "@/public/assets/adagioGirl.webp";

export default function CollectionsShowcase({
  collections,
  search,
  h1,
}: {
  collections: ProductCollection[];
  search?: string;
  h1?: string;
}) {
  const trimmedSearch = search?.trim();

  return (
    <section className="mx-auto max-w-350 px-5 pb-24 pt-8 md:px-16 md:pb-40 md:pt-12">
      <div>

      </div>
      <div className="mb-14 grid grid-cols-1 gap-6 md:mb-20 lg:grid-cols-2 lg:items-center">
        <div className="order-2 lg:order-1 ">
          <p className="mb-4 text-xs tracking-[1px] text-muted-foreground">
            آرشیو
          </p>

          <h1 className="text-[36px] font-black leading-28 text-foreground md:text-[64px]">
            {h1 ?? "دسته‌بندی پوشاک و محصولات هنری آداجیو"}
          </h1>
        </div>

        <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
          <Image
            src={AdagioGirl}
            alt="Adagio Girl"
            width={500}
            height={500}
            className="h-auto w-full max-w-87.5 object-contain md:max-w-100 lg:max-w-125 rounded-b-full"
          />
        </div>
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
              href="/store/collections"
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
              <CollectionCard collection={collection} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
