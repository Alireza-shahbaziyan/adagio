import { PaginatedResponse } from "./response";
  
  // Shared Image
  export interface ProductImage {
    id: number;
    image: string;
    media_kind: "gallery" | "thumbnail" | "cover";
    caption: string;
    alt_text: string;
    is_primary: boolean;
  }
  export interface ProductVariant {
    id: number;
    sku: string;
    size: number;
    size_name: "S"|"M"|"L"|"XL"|"2XL"|"3XL"|"4XL"|"5XL";
    price: number;
    compare_price: number | null;
    stock: number;
    is_active: boolean;
  }
  
  // Product
  export interface Product {
    id: number;
    title: string;
    slug: string;
    short_description: string;
    status: "active" | "inactive" | "draft";
    featured: boolean;
    published_at: string;
    images: ProductImage[];
    collections_list: string[];
    variants: ProductVariant[];
  }
  
  // API Response
  export type ProductsResponse = PaginatedResponse<Product>;