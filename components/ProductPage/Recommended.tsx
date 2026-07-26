import Link from "next/link";
import Reveal from "../Reveal";
import Image from "next/image";
import { RecentlyViewedItem } from "@/lib/hooks";
import { Product } from "@/types/products";

export default function Recommended({
  recommended,
  recentlyViewed,
}: {
  recommended: Product[];
  recentlyViewed: RecentlyViewedItem[];
}) {
  return (
    <>
      {recommended.length > 0 && (
        <Reveal>
          <section className="mx-auto max-w-350 px-5 pt-20 md:px-16 md:pt-32">
            <h2 className="mb-10   text-[26px] font-black text-foreground md:text-[40px]">
              پیشنهاد می‌کنیم
            </h2>
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {recommended.map((p) => {
                const image = p.images?.[0]?.image;
                const price = p.variants?.[0]?.price;
                return (
                  <Link
                    key={p.id}
                    href={`/store/product/${p.slug}`}
                    className="group block overflow-hidden rounded-[20px] bg-[#181818]"
                  >
                    <div className="relative aspect-4/5 overflow-hidden bg-[#111111]">
                      {image && (
                        <Image
                          src={image}
                          alt={p.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="p-4.5">
                      <p className="mb-1 text-[15px] text-foreground">
                        {p.title}
                      </p>
                      <p
                        style={{ direction: "ltr", textAlign: "right" }}
                        className="text-sm text-muted-foreground"
                      >
                        {price != null ? `$${price}` : ""}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </Reveal>
      )}

      {recentlyViewed.length > 0 && (
        <Reveal>
          <section className="mx-auto max-w-[1400px] px-5 pt-16 md:px-16 md:pt-24">
            <h2 className="mb-8   text-[22px] font-black text-foreground md:text-[30px]">
              بازدیدهای اخیر
            </h2>
            <div className="flex gap-5 overflow-x-auto pb-2">
              {recentlyViewed.map((p) => (
                <Link
                  key={p.id}
                  href={`/store/product/${p.slug}`}
                  className="flex-[0_0_140px]"
                >
                  <div className="relative mb-2.5 aspect-[4/5] overflow-hidden rounded-[14px] bg-[#111111]">
                    {p.image && (
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        sizes="140px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <p className="text-[13px] text-muted-foreground">{p.title}</p>
                </Link>
              ))}
            </div>
          </section>
        </Reveal>
      )}
    </>
  );
}
