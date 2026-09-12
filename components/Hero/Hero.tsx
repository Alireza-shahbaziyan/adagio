"use client";

import { type StaticImageData } from "next/image";
import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { A11y, Autoplay, EffectFade, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide, type SwiperRef } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-fade";

import heroImage from "/public/assets/slider/cas.jpg";
import lanaGirl from "/public/assets/slider/eminem.jpg";


import HeroSlide from "./HeroSlide";

export interface HeroSlideItem {
  id: number;
  image: StaticImageData;
  eyebrow: string;
  title: string;
  description: string;
  product: string;
}


const slides: HeroSlideItem[] = [
  {
    id: 1,
    image: heroImage,
    eyebrow: "آداجیو / ۰۱",
    title: "موسیقی‌ات\nرو بپوش",
    description: "برای موسیقی‌هایی که فقط شنیده نمی‌شوند؛ زندگی می‌شوند.",
    product: "کالکشن سیگرتس اَفتر سکس",
  },

  {
    id: 2,
    image: lanaGirl,
    eyebrow: "آداجیو / ۰۲",
    title: "هنر رو\nزندگی کن",
    description: "طرح‌هایی برای کسانی که موسیقی را بخشی از استایل خود می‌دانند.",
    product: "کالکشن موسیقی",
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
      className="relative min-h-140 w-full overflow-hidden bg-black text-white h-[80vh] lg:h-[90vh] "
    >
      <Swiper
        ref={swiperRef}
        modules={[Autoplay, EffectFade, Keyboard, A11y]}
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
        className="hero-swiper h-full! w-full! overflow-hidden! "
        a11y={{
          enabled: true,
          prevSlideMessage: "اسلاید قبلی",
          nextSlideMessage: "اسلاید بعدی",
          firstSlideMessage: "این اولین اسلاید است",
          lastSlideMessage: "این آخرین اسلاید است",
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide
            key={slide.id}
            className="h-full! w-full! overflow-hidden"
          >
            <HeroSlide
              slide={slide}
              index={index}
              onPrevious={handlePrevious}
              onNext={handleNext}
              countSlice={slides.length}
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
          <ArrowRight size={15} strokeWidth={1.5} />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="اسلاید بعدی"
          className="flex h-10 w-10 items-center justify-center border border-white/20 bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-black"
        >
          <ArrowLeft size={15} strokeWidth={1.5} />
        </button>
      </div>

      {/* Scroll hint */}
      <div className="pointer-events-none absolute bottom-10 right-1/2 z-40 hidden translate-x-1/2 flex-col items-center gap-3 text-xs md:text-sm tracking-[0.25em] text-white/35 lg:flex">
        <span>پایین برو</span>

        <span className="h-10 w-1 bg-linear-to-b from-white/70 to-transparent" />
      </div>
    </section>
  );
}
