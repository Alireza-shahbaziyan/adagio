"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
} from "lucide-react";

import { A11y, Autoplay, EffectFade, Keyboard } from "swiper/modules";
import {
  Swiper,
  SwiperSlide,
  type SwiperRef,
} from "swiper/react";

import "swiper/css";
import "swiper/css/effect-fade";

import heroImage from "/public/assets/cigsaftersecmerch.webp";
import lanaGirl from "/public/assets/adagioGirl.webp";
import stargirl from "/public/assets/stargirl.jpg";

interface HeroSlide {
  id: number;
  image: StaticImageData;
  eyebrow: string;
  title: string;
  description: string;
  product: string;
}

const slides: HeroSlide[] = [
  {
    id: 1,
    image: heroImage,
    eyebrow: "آداجیو / ۰۱",
    title: "موسیقی‌ات\nرو بپوش",
    description: "هر اثر، داستانی‌ست که پوشیده می‌شود.",
    product: "کالکشن سیگرتس اَفتر سکس",
  },
  {
    id: 2,
    image: lanaGirl,
    eyebrow: "آداجیو / ۰۲",
    title: "هنر رو\nبپوش",
    description:
      "طراحی‌هایی برای کسانی که موسیقی را زندگی می‌کنند.",
    product: "کالکشن موسیقی",
  },
  {
    id: 3,
    image: stargirl,
    eyebrow: "آداجیو / ۰۳",
    title: "آروم\nماندگار.",
    description: "استایل مینیمال، موسیقی ماندگار.",
    product: "کالکشن ویژه",
  },
];

const AUTOPLAY_DELAY = 5500;

export default function Hero() {
  const swiperRef = useRef<SwiperRef | null>(null);

  const handlePrevious = () => {
    swiperRef.current?.swiper.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.swiper.slideNext();
  };

  return (
    <section
      dir="rtl"
      aria-label="محصولات ویژه آداجیو"
      className="relative h-[75vh] min-h-140 w-full overflow-hidden bg-black text-white md:h-[80vh] lg:h-[90vh]"
    >
      <Swiper
        ref={swiperRef}
        modules={[
          Autoplay,
          EffectFade,
          Keyboard,
          A11y,
        ]}
        dir="rtl"
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        speed={1200}
        loop
        autoplay={{
          delay: AUTOPLAY_DELAY,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        keyboard={{
          enabled: true,
          onlyInViewport: true,
        }}
        grabCursor
        allowTouchMove
        watchSlidesProgress
        className="hero-swiper h-full w-full"
        a11y={{
          enabled: true,
          prevSlideMessage: "اسلاید قبلی",
          nextSlideMessage: "اسلاید بعدی",
          firstSlideMessage: "این اولین اسلاید است",
          lastSlideMessage: "این آخرین اسلاید است",
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <HeroSlide
              slide={slide}
              index={index}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
          </SwiperSlide>
        ))}

        {/* Progress */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-1">
          <div className="hero-progress h-full w-full origin-right bg-white/20">
            <div className="hero-progress-bar h-full origin-right bg-white" />
          </div>
        </div>
      </Swiper>

      {/* Mobile navigation */}
      <div className="absolute bottom-7 left-6 z-40 flex items-center gap-2 md:hidden">
        <button
          type="button"
          onClick={handlePrevious}
          aria-label="اسلاید قبلی"
          className="flex h-10 w-10 items-center justify-center border border-white/20 bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-black"
        >
          <ArrowRight
            size={15}
            strokeWidth={1.5}
          />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="اسلاید بعدی"
          className="flex h-10 w-10 items-center justify-center border border-white/20 bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-black"
        >
          <ArrowLeft
            size={15}
            strokeWidth={1.5}
          />
        </button>
      </div>

      {/* Scroll hint */}
      <div className="pointer-events-none absolute bottom-10 right-1/2 z-40 hidden translate-x-1/2 flex-col items-center gap-3 text-[9px] tracking-[0.25em] text-white/35 lg:flex">
        <span>پایین برو</span>

        <span className="h-10 w-px bg-linear-to-b from-white/70 to-transparent" />
      </div>
    </section>
  );
}

interface HeroSlideProps {
  slide: HeroSlide;
  index: number;
  onPrevious: () => void;
  onNext: () => void;
}

function HeroSlide({
  slide,
  index,
  onPrevious,
  onNext,
}: HeroSlideProps) {
  return (
    <article className="relative h-full w-full overflow-hidden">
      {/* Image */}
      <Image
        src={slide.image}
        alt={slide.product}
        fill
        priority={index === 0}
        sizes="100vw"
        className="hero-image object-cover object-center"
      />

      {/* Base overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/25"
      />

      {/* Text readability */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-l from-black via-black/55 to-transparent"
      />

      {/* Bottom fade */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[45%] bg-linear-to-t from-black via-black/35 to-transparent"
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
            <h1 className="whitespace-pre-line text-[clamp(3.5rem,10vw,9rem)] font-extrabold leading-[0.9] tracking-[-0.035em] text-white md:text-8xl md:leading-36">
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
            <button
              type="button"
              className="group mt-7 inline-flex items-center gap-3 border border-white/25 bg-white px-5 py-3 text-xs font-medium tracking-[0.12em] text-black transition-all duration-300 hover:bg-white/90 md:mt-9 md:px-6 md:py-3.5"
            >
              <span>مشاهده کالکشن</span>

              <ArrowUpLeft
                size={15}
                strokeWidth={1.7}
                className="transition-transform duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1"
              />
            </button>
          </div>

          {/* Desktop controls */}
          <div className="hidden w-47.5 flex-col items-start gap-6 md:flex">

            {/* Counter */}
            <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] text-white/50">
              <span className="hero-current text-white">
                ۰۱
              </span>

              <span>/</span>

              <span>
                {toPersianNumber(slides.length)}
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

function toPersianNumber(value: number) {
  return value
    .toString()
    .padStart(2, "0")
    .replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
}
