import { ArrowLeft, ArrowRight, ArrowUpLeft } from "lucide-react";
import Image from "next/image";
import { HeroSlideItem } from "./Hero";
import Link from "next/link";

interface HeroSlideProps {
  slide: HeroSlideItem;
  index: number;
  onPrevious: () => void;
  onNext: () => void;
  countSlice:number;
}

export default function HeroSlide({
  slide,
  index,
  onPrevious,
  onNext,
  countSlice,
}: HeroSlideProps) {
  return (
<article className="relative h-full w-full overflow-hidden">
  <div className="absolute inset-0 overflow-hidden bg-black">
    <Image
      src={slide.image}
      alt={slide.product}
      fill
      priority={index === 0}
      sizes="100vw"
      className="hero-image block h-full w-full object-cover object-center"
    />
  </div>

  {/* Base overlay */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-black/25"
  />

  {/* Text readability */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-linear-to-l from-black via-black/40 to-transparent"
  />

  {/* Bottom fade */}
  <div
    aria-hidden="true"
    className="absolute inset-x-0 bottom-0 h-[45%] bg-linear-to-t from-black via-black/30 to-transparent"
  />

  {/* Grain */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.045)_1px,transparent_1px)] bg-size-[4px_4px] opacity-20 mix-blend-overlay"
  />
      {/* Content */}
      <div className="relative z-10 flex h-full w-full items-end">
        <div className="mx-auto flex w-full max-w-[1600px] items-end justify-between px-6 pb-12 sm:px-8 md:px-12 md:pb-16 lg:px-16 lg:pb-20 xl:px-20">

          {/* Content */}
          <div className="hero-content max-w-170 text-right">
            {/* Eyebrow */}
            <div className="mb-5 flex items-center justify-start gap-3 text-[10px] font-medium tracking-[0.2em] text-white/55 md:text-xs">
              <span className="h-px w-8 bg-white/50" />
              <span>{slide.eyebrow}</span>
            </div>

            {/* Title */}
            <h1 className="whitespace-pre-line text-[clamp(3.5rem,10vw,9rem)] md:text-nowrap font-extrabold leading-20
                           tracking-[-0.035em] text-white md:text-8xl md:leading-36">
              {slide.title}
            </h1>

            {/* Description */}
            <div className="mt-7 flex max-w-107.5 items-start gap-4 md:mt-9">
              <p className="font-sans text-sm leading-7 text-white/65 md:text-base">
                {slide.description}
              </p>

              <div className="mt-3 h-px w-7 shrink-0 bg-white/40" />
            </div>

            {/* CTA */}
            <Link href="/store/collections"
              type="button"
              className="group mt-7 inline-flex items-center gap-3 border border-white/25 bg-white px-5 py-3 text-xs font-medium tracking-[0.12em] text-black transition-all duration-300 hover:bg-white/90 md:mt-9 md:px-6 md:py-3.5"
            >
              <span>مشاهده کالکشن</span>

              <ArrowUpLeft
                size={15}
                strokeWidth={1.7}
                className="transition-transform duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>

          {/* Desktop controls */}
          <div className="hidden w-47.5 flex-col items-start gap-6 md:flex">

            {/* Counter */}
            <div className="flex items-center gap-3 font-interFontForEnglishChar text-xs md:text-sm tracking-[0.2em] text-white/50">
              <span className="hero-current text-white">
                {index + 1}
              </span>

              <span>/</span>

              <span>
                {countSlice}
              </span>
            </div>

            {/* Progress */}
            <div className="h-px w-full overflow-hidden bg-white/20">
              <div className="hero-progress-desktop h-full w-full origin-right bg-white" />
            </div>

            {/* Navigation */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onPrevious}
                aria-label="اسلاید قبلی"
                className="flex h-11 w-11 items-center justify-center border border-white/20 text-white/70 transition-all duration-300 hover:border-white/60 hover:bg-white hover:text-black"
              >
                <ArrowRight
                  size={16}
                  strokeWidth={1.5}
                />
              </button>

              <button
                type="button"
                onClick={onNext}
                aria-label="اسلاید بعدی"
                className="flex h-11 w-11 items-center justify-center border border-white/20 text-white/70 transition-all duration-300 hover:border-white/60 hover:bg-white hover:text-black"
              >
                <ArrowLeft
                  size={16}
                  strokeWidth={1.5}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}