import { ProductImage, ProductVariant } from "./products";

export interface ProductCollection {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  is_active: boolean;
  parent: number;
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
  variants: ProductVariant[];
  created_at: string;
  updated_at: string;
}