import { ProductsResponse } from "@/types/products";
import { CollectionResponse } from "@/types/collections";
import { ProductCollection } from "@/types/singleProduct";
import { Callection } from "@/types/singleCollection";
import { backend } from "@/utils/getURL";

export const PRODUCTS_PAGE_SIZE = 20;

export const ORDERING_OPTIONS = [
  { value: "-published_at", label: "جدیدترین" },
  { value: "published_at", label: "قدیمی‌ترین" },
] as const;

export type OrderingValue = (typeof ORDERING_OPTIONS)[number]["value"];
export const DEFAULT_ORDERING: OrderingValue = "-published_at";

export function isOrderingValue(value: string | undefined): value is OrderingValue {
  return ORDERING_OPTIONS.some((option) => option.value === value);
}

export type FeaturedFilter = "true" | "false" | undefined;

export function parseFeaturedParam(value: string | undefined): FeaturedFilter {
  return value === "true" || value === "false" ? value : undefined;
}

export function parsePageParam(value: string | undefined): number {
  const page = Number(value);
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

export async function getStoreProducts({
  collectionSlug,
  featured,
  search,
  ordering,
  page,
  pageSize,
}: {
  collectionSlug?: string;
  featured?: string;
  search?: string;
  ordering?: string;
  page?: string;
  pageSize?: number;
}): Promise<ProductsResponse> {
  const query = new URLSearchParams();

  if (collectionSlug) query.set("collections__slug", collectionSlug);

  const featuredValue = parseFeaturedParam(featured);
  if (featuredValue) query.set("featured", featuredValue);

  query.set("ordering", isOrderingValue(ordering) ? ordering : DEFAULT_ORDERING);
  query.set("page", String(parsePageParam(page)));
  query.set("page_size", String(pageSize ?? PRODUCTS_PAGE_SIZE));

  const trimmedSearch = search?.trim();
  if (trimmedSearch) query.set("search", trimmedSearch);

  const res = await fetch(`${backend}/api/products/?${query.toString()}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) throw new Error("Failed to fetch products");

  return res.json();
}

export async function getStoreCollections(): Promise<ProductCollection[]> {
  const res = await fetch(
    `${backend}/api/collections/?ordering=slug&page=1&page_size=100`,
    { next: { revalidate: 60 * 60 } },
  );

  if (!res.ok) return [];

  const data: CollectionResponse = await res.json();
  return data.results;
}

export async function getCollectionBySlug(slug: string): Promise<Callection | null> {
  const res = await fetch(`${backend}/api/collections/${slug}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) return null;

  return res.json();
}

export type StoreQueryState = {
  search?: string;
  ordering?: string;
  featured?: string;
  page?: string;
};

/** Builds a `key=value&…` query string, dropping defaults/empties so URLs stay clean.
 * Any key explicitly passed in `overrides` replaces the current value; omit a key from
 * `overrides` to keep it, or pass `undefined` to clear it. */
export function buildStoreQuery(
  current: StoreQueryState,
  overrides: Partial<StoreQueryState>,
): string {
  const next: StoreQueryState = { ...current, ...overrides };
  const query = new URLSearchParams();

  if (next.search?.trim()) query.set("search", next.search.trim());
  if (next.ordering && next.ordering !== DEFAULT_ORDERING) query.set("ordering", next.ordering);
  if (next.featured === "true" || next.featured === "false") query.set("featured", next.featured);
  if (next.page && next.page !== "1") query.set("page", next.page);

  const qs = query.toString();
  return qs ? `?${qs}` : "";
}
