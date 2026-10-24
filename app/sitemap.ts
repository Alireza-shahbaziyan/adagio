
import { backend, referer } from "@/utils/getURL";
import type { MetadataRoute } from "next";

interface SitemapItem {
  slug: string;
  updated_at: string;
}

const API_URL = backend;
const SITE_URL = referer;

async function fetchSitemapItems(
  endpoint: string,
): Promise<SitemapItem[]> {
  const response = await fetch(`${API_URL}/api/seo/sitemap/${endpoint}/`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch sitemap ${endpoint}: ${response.status}`,
    );
  }

  return response.json() as Promise<SitemapItem[]>;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections, categories, posts] = await Promise.all([
    fetchSitemapItems("products"),
    fetchSitemapItems("collections"),
    fetchSitemapItems("categories"),
    fetchSitemapItems("posts"),
  ]);

  return [
    ...products.map((item) => ({
      url: `${SITE_URL}/store/products/${item.slug}`,
      lastModified: item.updated_at,
    })),

    ...collections.map((item) => ({
      url: `${SITE_URL}/store/collections/${item.slug}`,
      lastModified: item.updated_at,
    })),

    ...categories.map((item) => ({
      url: `${SITE_URL}/store/categories/${item.slug}`,
      lastModified: item.updated_at,
    })),

    ...posts.map((item) => ({
      url: `${SITE_URL}/blog/${item.slug}`,
      lastModified: item.updated_at,
    })),
  ];
}
