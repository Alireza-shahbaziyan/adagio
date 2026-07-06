"use client";

import Image from "next/image";
import { useScrollY } from "@/lib/hooks";

export default function Hero() {
  const scrollY = useScrollY();

  // Animation Progress
  const progress = Math.min(scrollY / 420, 1);

  // Ease Out Cubic
  const easedProgress = 1 - Math.pow(1 - progress, 3);

  const heroScale = 1 + easedProgress * 0.1;
  const heroTranslate = easedProgress * -70;
  const heroOpacity = 1 - easedProgress;

  const titleTranslate = easedProgress * -30;

  const scrollCueOpacity = Math.max(1 - scrollY / 260, 0);

  return (
    <section className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-[#050505] md:h-screen">
      <div className="film-grain" />

      {/* Top Label */}
      <div className="absolute inset-x-0 top-24 z-10 px-6 text-center md:top-28">
        <span className="text-xs tracking-[1px] text-[#A8A8A8]">
          پوشاک استریت مشکی و سفید
        </span>
      </div>

      {/* Spotlight */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 72%, rgba(243,243,243,.14), transparent 55%)",
        }}
      />

      {/* Mountains */}
      <div
        className="absolute inset-x-0 bottom-0 h-[28%] bg-[#151515]"
        style={{
          clipPath:
            "polygon(0% 100%,0% 55%,6% 70%,14% 40%,24% 62%,34% 35%,44% 58%,54% 30%,64% 55%,74% 38%,84% 60%,92% 42%,100% 58%,100% 100%)",
        }}
      />

      <div
        className="absolute inset-x-0 bottom-0 h-[17%] bg-[#080808]"
        style={{
          clipPath:
            "polygon(0% 100%,0% 70%,10% 82%,20% 60%,32% 78%,44% 55%,56% 75%,68% 58%,80% 78%,90% 62%,100% 75%,100% 100%)",
        }}
      />

      {/* Hero */}
      <div
        className="absolute inset-0 flex items-center justify-center bg-hero will-change-transform"
        style={{
          transform: `translate3d(0, ${heroTranslate}px, 0) scale(${heroScale})`,
          opacity: heroOpacity,
        }}
      >
        {/* Title */}
        <div
          style={{
            direction: "ltr",
            transform: `translate3d(0, ${titleTranslate}px, 0)`,
          }}
          className="absolute inset-x-0 z-10 text-center"
        >
          <span className="font-anton text-9xl leading-[0.85] text-[#dcdcdc] md:text-[31vw]">
            ADAGIO
          </span>
        </div>

        {/* Person */}
        <div className="relative z-20 h-[90svh] w-auto md:h-[min(72vh,620px)]">
          <Image
            src="/assets/heroPerson.png"
            alt=""
            width={620}
            height={775}
            priority
            className="h-full w-auto object-contain select-none pointer-events-none"
            style={{
              filter:
                "grayscale(1) contrast(1.12) brightness(.92) drop-shadow(0 30px 60px rgba(0,0,0,.6))",
              maskImage:
                "radial-gradient(ellipse 58% 74% at 50% 46%, black 55%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 58% 74% at 50% 46%, black 55%, transparent 100%)",
            }}
          />
        </div>
      </div>

      {/* Bottom Text */}
      <div className="absolute inset-x-0 bottom-28 z-10 px-6 text-center md:bottom-32">
        <p
          className="mx-auto max-w-72 text-[13px] leading-[1.7] text-[#d8d8d8] md:max-w-105 md:text-base"
          style={{
            textShadow: "0 2px 14px rgba(0,0,0,.7)",
          }}
        >
          طرح‌های تک‌رنگ برای شب‌های دیر و رانندگی‌های طولانی.
        </p>
      </div>

      {/* Scroll Hint */}
      <div
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2.5"
        style={{ opacity: scrollCueOpacity }}
      >
        <span className="text-[10px] tracking-[1px] text-[#A8A8A8]">
          اسکرول کن
        </span>

        <div
          className="h-8 w-px"
          style={{
            background:
              "linear-gradient(180deg,#A8A8A8,transparent)",
            animation: "scrollHint 2s ease-in-out infinite",
          }}
        />
      </div>
    </section>
  );
}