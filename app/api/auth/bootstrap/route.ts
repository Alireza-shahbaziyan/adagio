import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/utils/getURL";
import { forwardSetCookie } from "@/utils/forwardSetCookie";
import type { Cart } from "@/types/cart";
import type { WishlistItem } from "@/types/wishlist";
import type { User } from "@/types/auth";

export const dynamic = "force-dynamic";

async function safeFetch<T>(
  path: string,
  cookie: string,
): Promise<{ data: T | null; res: Response | null }> {
  try {
    const res = await fetch(`${backend}${path}`, {
      headers: { "Content-Type": "application/json", cookie },
      cache: "no-store",
    });
    if (!res.ok) return { data: null, res };
    const data = (await res.json().catch(() => null)) as T | null;
    return { data, res };
  } catch {
    return { data: null, res: null };
  }
}

/**
 * Combines the three requests every page needs (session, cart, wishlist count)
 * into one round trip — Navbar/MobileBottomNav otherwise fire useMe + useCart +
 * useWishlist separately on every navigation.
 *
 * Stub: not yet wired into any component. To use it, swap Navbar's
 * useMembership/useCartItemCount/useWishlistCount for hooks/useBootstrap.ts.
 */
export async function GET(req: NextRequest) {
  const cookie = req.headers.get("cookie") ?? "";

  const [meResult, cartResult] = await Promise.all([
    safeFetch<User>("/api/auth/me/", cookie),
    safeFetch<Cart>("/api/cart/", cookie),
  ]);

  // Wishlist requires an authenticated session — skip it for guests rather
  // than firing a request that's guaranteed to 403.
  const wishlistResult = meResult.data
    ? await safeFetch<WishlistItem[]>("/api/wishlist/", cookie)
    : null;

  const response = NextResponse.json({
    user: meResult.data,
    cartCount:
      cartResult.data?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
    wishlistCount: wishlistResult?.data?.length ?? 0,
  });

  for (const result of [meResult, cartResult, wishlistResult]) {
    if (!result?.res) continue;
    forwardSetCookie(result.res, response, req);
  }

  return response;
}
