"use client";

import { useEffect, useState } from "react";

export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
}

export function useScrollY(): number {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return scrollY;
}

const RECENTLY_VIEWED_KEY = "adagio:recently-viewed";
const RECENTLY_VIEWED_LIMIT = 8;

export type RecentlyViewedItem = {
  id: number;
  slug: string;
  title: string;
  image: string | null;
};

export function useRecentlyViewed(
  current: RecentlyViewedItem | null,
): RecentlyViewedItem[] {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    if (!current) return;
    try {
      const stored: RecentlyViewedItem[] = JSON.parse(
        window.localStorage.getItem(RECENTLY_VIEWED_KEY) ?? "[]",
      );
      const others = stored.filter((item) => item.id !== current.id);
      setItems(others);
      window.localStorage.setItem(
        RECENTLY_VIEWED_KEY,
        JSON.stringify([current, ...others].slice(0, RECENTLY_VIEWED_LIMIT)),
      );
    } catch {
      // localStorage unavailable (privacy mode, disabled storage, etc.)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  return items;
}
