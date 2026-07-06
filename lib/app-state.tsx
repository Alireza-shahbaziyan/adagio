"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

type AppStateContextValue = {
  cartCount: number;
  wishlist: string[];
  isWishlisted: (id: string) => boolean;
  addToCart: (name: string, qty?: number, message?: string) => void;
  toggleWishlist: (id: string, name: string) => void;
  toastMessage: string;
  toastVisible: boolean;
  showToast: (message: string) => void;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [cartCount, setCartCount] = useState(0);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMessage(message);
    setToastVisible(true);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2200);
  }, []);

  const isWishlisted = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  const addToCart = useCallback(
    (name: string, qty: number = 1, message?: string) => {
      setCartCount((c) => c + qty);
      showToast(message ?? `${name} به سبد خرید اضافه شد`);
    },
    [showToast]
  );

  const toggleWishlist = useCallback(
    (id: string, name: string) => {
      setWishlist((prev) => {
        const has = prev.includes(id);
        showToast(has ? `${name} از علاقه‌مندی‌ها حذف شد` : `${name} به علاقه‌مندی‌ها اضافه شد`);
        return has ? prev.filter((w) => w !== id) : [...prev, id];
      });
    },
    [showToast]
  );

  const value = useMemo(
    () => ({
      cartCount,
      wishlist,
      isWishlisted,
      addToCart,
      toggleWishlist,
      toastMessage,
      toastVisible,
      showToast,
    }),
    [cartCount, wishlist, isWishlisted, addToCart, toggleWishlist, toastMessage, toastVisible, showToast]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
