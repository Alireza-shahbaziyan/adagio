import { PaginatedResponse } from "./response";

export interface ProductImage {
  id: number;
  image: string;
  media_kind: "gallery" | "thumbnail" | "cover";
  caption: string;
  alt_text: string;
  is_primary: boolean;
}
export interface SizeAttribute {
  key: string;
  value: string;
  sort_order: number;
}

export interface Size {
  name: string;
  label: string;
  attributes: SizeAttribute[] | null;
}

export interface ProductVariant {
  id: number;
  sku: string;
  size: Size | null;
  size_name: string;
  price: number;
  compare_price: number | null;
  stock: number;
  is_active: boolean;
}

export interface Audio {
  id: number;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  status: "active" | "inactive" | "draft";
  featured: boolean;
  audio: Audio | null;
  published_at: string;
  images: ProductImage[];
  collections_list: string[];
  variants: ProductVariant[];
}

export type ProductsResponse = PaginatedResponse<Product>;
