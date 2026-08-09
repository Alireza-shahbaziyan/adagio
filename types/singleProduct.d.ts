import { Audio, ProductImage, ProductVariant } from "./products";

export interface ProductCollection {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  is_active: boolean;
  parent: number | null;
  image: string | null;
}

export interface ProductTag {
  id: number;
  title: string;
  slug: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  status: "active" | "inactive" | "draft";
  published_at: string;
  featured: boolean;
  collections: ProductCollection[];
  tags: ProductTag[];
  images: ProductImage[];
  audio: Audio | null;
  variants: ProductVariant[];
  is_in_wishlist: boolean;
  meta_tag: Record<string, unknown> | null;
  json_ld: Record<string, unknown>;
  breadcrumb_ld: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
