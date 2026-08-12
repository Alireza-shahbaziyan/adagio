import { backend } from "@/utils/getURL";
import type { MetadataRoute } from "next";

interface SitemapItem {
  slug: string;
  updated_at: string;
}

const API_URL = backend;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections, categories, posts] = await Promise.all([
    fetch(`${API_URL}/api/seo/sitemap/products/`).then((res) => res.json()),
    fetch(`${API_URL}/api/seo/sitemap/collections/`).then((res) => res.json()),
    fetch(`${API_URL}/api/seo/sitemap/categories/`).then((res) => res.json()),
    fetch(`${API_URL}/api/seo/sitemap/posts/`).then((res) => res.json()),
  ]);
  return [
    ...products.map((item: SitemapItem) => ({
      url: `https://adagiostyle.ir/store/products/${item.slug}`,
      lastModified: item.updated_at,
    })),

    ...collections.map((item: SitemapItem) => ({
      url: `https://adagiostyle.ir/store/collections/${item.slug}`,
      lastModified: item.updated_at,
    })),

    ...categories.map((item: SitemapItem) => ({
      url: `https://adagiostyle.ir/store/categories/${item.slug}`,
      lastModified: item.updated_at,
    })),

    ...posts.map((item: SitemapItem) => ({
      url: `https://adagiostyle.ir/blog/${item.slug}`,
      lastModified: item.updated_at,
    })),
  ];
}
