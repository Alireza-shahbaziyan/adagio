"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
// import { Product } from "@/lib/products";
// import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { Product } from "@/types/products";

type BestSellersCarouselProps = {
  products: Product[];
};

export default function BestSellersCarousel({products}: BestSellersCarouselProps) {
  const ref = useRef<HTMLDivElement>(null);

  // const scrollBy = (delta: number) => {
  //   ref.current?.scrollBy({ left: delta, behavior: "smooth" });
  // };
  if (!products || products.length === 0) {
    return null;
  }
  return (
    <section className="relative z-1 pb-20 md:pb-40">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6 px-5 md:px-16">
        <h2 className="  text-[28px] font-black text-foreground md:text-[48px]">
          پرفروش‌ترین‌ها
        </h2>
        {/* <div className="flex flex-row-reverse gap-3">
          <button
            onClick={() => scrollBy(-340)}
            className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-white/20 text-foreground transition-colors hover:bg-white/8 hover:border-white/40"
          >
            <ChevronLeftIcon />
          </button>
          <button
            onClick={() => scrollBy(340)}
            className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-white/20 text-foreground transition-colors hover:bg-white/8 hover:border-white/40"
          >
            <ChevronRightIcon />
          </button>
        </div> */}
      </div>
      <div
        ref={ref}
        className="flex gap-6 overflow-x-auto px-5 pb-3 md:px-16"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/store/product/${p.slug}`}
            style={{ scrollSnapAlign: "start" }}
            className="group block flex-[0_0_clamp(240px,28vw,320px)] overflow-hidden rounded-[20px] bg-[#181818]"
          >
            <div className="relative aspect-4/5 overflow-hidden">
              <Image
                src={p.images[0].image}
                alt={p.images[0].alt_text}
                fill
                sizes="320px"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
            <div className="p-4.5">
              <p className="mb-1 text-[15px] text-foreground">{p.title}</p>
              <p
                style={{ direction: "ltr", textAlign: "right" }}
                className="text-sm text-muted-foreground"
              >
               {p.variants[0].price.toLocaleString("fa-IR")} تومان
              </p>
         
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
