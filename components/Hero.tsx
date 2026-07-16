"use client";

import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "motion/react";

// Same easing as the original component
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  // Physics-based smoothing — all scroll-linked transforms read from this
  const smoothY = useSpring(scrollY, {
    stiffness: 140,
    damping: 26,
    mass: 0.4,
  });

  // Hero (image + title container)
  const heroY = useTransform(smoothY, [0, 420], [0, -70], {
    ease: easeOutCubic,
  });
  const heroScale = useTransform(smoothY, [0, 420], [1, 1.1], {
    ease: easeOutCubic,
  });
  const heroOpacity = useTransform(smoothY, [0, 420], [1, 0], {
    ease: easeOutCubic,
  });

  // Title: slight upward parallax + the two halves splitting apart.
  // vw units keep the split proportional on every screen size.
  const titleY = useTransform(smoothY, [0, 420], [0, -30], {
    ease: easeOutCubic,
  });
  const titleLeftX = useTransform(smoothY, [0, 420], ["0vw", "-48vw"], {
    ease: easeOutCubic,
  });
  const titleRightX = useTransform(smoothY, [0, 420], ["0vw", "48vw"], {
    ease: easeOutCubic,
  });

  // Bottom text
  const bottomScale = useTransform(smoothY, [0, 500], [1, 1.35], {
    ease: easeOutCubic,
  });
  const bottomOpacity = useTransform(scrollY, [0, 500], [0.7, 1]);

  // Scroll cue — tied to raw scroll so it reacts instantly
  const cueOpacity = useTransform(scrollY, [0, 260], [1, 0]);

  return (
    <section className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-[#050505] md:h-screen">
      <div className="film-grain" aria-hidden="true" />

      {/* Spotlight */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 50% 72%, rgba(243,243,243,.14), transparent 55%)",
        }}
      />

      {/* Mountains */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%] bg-[#151515]"
        aria-hidden="true"
        style={{
          clipPath:
            "polygon(0% 100%,0% 55%,6% 70%,14% 40%,24% 62%,34% 35%,44% 58%,54% 30%,64% 55%,74% 38%,84% 60%,92% 42%,100% 58%,100% 100%)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[17%] bg-[#080808]"
        aria-hidden="true"
        style={{
          clipPath:
            "polygon(0% 100%,0% 70%,10% 82%,20% 60%,32% 78%,44% 55%,56% 75%,68% 58%,80% 78%,90% 62%,100% 75%,100% 100%)",
        }}
      />

      {/* Hero */}
      <motion.div
        className="pointer-events-none absolute inset-0 flex items-center justify-center bg-hero"
        style={{
          y: reduceMotion ? 0 : heroY,
          scale: reduceMotion ? 1 : heroScale,
          opacity: heroOpacity,
        }}
      >
        {/* Title — two halves that slide apart on scroll */}
        <motion.div
          dir="ltr"
          className="absolute inset-x-0 z-10"
          style={{ y: reduceMotion ? 0 : titleY }}
        >
          <h1
            aria-label="ADAGIO"
            className="flex items-center justify-center font-anton text-[26vw] leading-[0.85] text-[#dcdcdc] sm:text-[24vw] md:text-[31vw]"
          >
            <motion.span
              aria-hidden="true"
              className="inline-block will-change-transform"
              style={{ x: reduceMotion ? 0 : titleLeftX }}
            >
              ADA
            </motion.span>
            <motion.span
              aria-hidden="true"
              className="inline-block will-change-transform"
              style={{ x: reduceMotion ? 0 : titleRightX }}
            >
              GIO
            </motion.span>
          </h1>
        </motion.div>

        {/* Person — taller and more dominant on mobile */}
        <div className="relative z-20 h-[92svh] w-auto md:h-[min(72vh,620px)]">
          <Image
            src="/assets/heroPerson.png"
            alt=""
            width={620}
            height={775}
            priority
            className="pointer-events-none h-full w-auto object-contain select-none"
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
      </motion.div>

      {/* Bottom Text */}
      <motion.div
        dir="rtl"
        lang="fa"
        className="pointer-events-none absolute inset-x-0 bottom-28 z-30 px-6 text-center font-thin md:bottom-14"
        style={{
          scale: reduceMotion ? 1 : bottomScale,
          opacity: bottomOpacity,
        }}
      >
        <p className="mx-auto max-w-64 text-[13px] leading-[1.7] sm:max-w-72 md:max-w-105 md:text-xl">
          برای شب‌هایی که موسیقی تنها هم‌صحبت توست
        </p>
      </motion.div>

      {/* Scroll Hint */}
      <motion.div
        dir="rtl"
        lang="fa"
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2.5 bottom-[max(2rem,calc(env(safe-area-inset-bottom)+1rem))]"
        style={{ opacity: cueOpacity }}
      >
        <span className="text-[10px] tracking-[1px] text-muted-foreground">
          اسکرول کن
        </span>

        <motion.div
          className="h-8 w-px"
          style={{
            background: "linear-gradient(180deg,#A8A8A8,transparent)",
          }}
          animate={
            reduceMotion ? undefined : { y: [0, 6, 0], opacity: [1, 0.4, 1] }
          }
          transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}