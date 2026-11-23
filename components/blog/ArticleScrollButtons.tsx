"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronDownIcon } from "@/components/icons";

const TOP_THRESHOLD = 96;
const BOTTOM_THRESHOLD = 96;

/**
 * Floating scroll-to-top / scroll-to-bottom controls for long blog articles.
 *
 * Fixed to the viewport edge, hidden whenever their destination is already
 * reached, and rendered on the client only so the article itself stays fully
 * server-rendered. Scrolling uses the browser's smooth behavior unless the
 * visitor prefers reduced motion.
 */
export default function ArticleScrollButtons() {
  // SSR/initial paint matches a fresh page visit: at the top, never at bottom.
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const updateState = () => {
      const root = document.documentElement;
      const scrolled = window.scrollY;
      const viewportEnd = scrolled + window.innerHeight;

      setAtTop(scrolled <= TOP_THRESHOLD);
      setAtBottom(
        viewportEnd >= root.scrollHeight - BOTTOM_THRESHOLD,
      );
    };

    let frame = 0;
    const handleChange = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateState();
      });
    };

    updateState();
    window.addEventListener("scroll", handleChange, { passive: true });
    window.addEventListener("resize", handleChange);

    return () => {
      window.removeEventListener("scroll", handleChange);
      window.removeEventListener("resize", handleChange);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const smoothScrollTo = useCallback((top: number) => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, []);

  const scrollToBottom = useCallback(() => {
    smoothScrollTo(document.documentElement.scrollHeight);
  }, [smoothScrollTo]);

  const buttonClass =
    "flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/60 text-foreground shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-white/10 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

  return (
    <div
      className="fixed left-4 bottom-[calc(1.25rem_+_env(safe-area-inset-bottom))] z-40 flex flex-col gap-2.5 md:left-6 md:bottom-[calc(2rem_+_env(safe-area-inset-bottom))]"
    >
      {!atTop && (
        <button
          type="button"
          onClick={() => smoothScrollTo(0)}
          aria-label="اسکرول به بالای صفحه"
          title="اسکرول به بالای صفحه"
          className={buttonClass}
        >
          <span
            aria-hidden="true"
            className="block rotate-180"
          >
            <ChevronDownIcon size={18} />
          </span>
        </button>
      )}

      {!atBottom && (
        <button
          type="button"
          onClick={scrollToBottom}
          aria-label="اسکرول به انتهای صفحه"
          title="اسکرول به انتهای صفحه"
          className={buttonClass}
        >
          <span aria-hidden="true">
            <ChevronDownIcon size={18} />
          </span>
        </button>
      )}
    </div>
  );
}
