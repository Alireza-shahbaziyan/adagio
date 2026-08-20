import { Audio, ProductImage, ProductVariant } from "./products";

export interface Product {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  status: "active" | "inactive";
  published_at: string | null;
  featured: boolean;

  collections: Collection[];
  images: ProductImage[];
  audio: Audio | null;
  variants: ProductVariant[];

  is_in_wishlist: boolean;

  meta_tag: ProductMetaTag;
  json_ld: ProductJsonLd;
  breadcrumb_ld: BreadcrumbJsonLd;

  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  image: string | null;
  image_dark: string | null;
  is_active: boolean;
  parent: number | null;
}


export interface ProductSize {
  name: string;
  label: string;
  attributes: ProductSizeAttribute[];
}

export interface ProductSizeAttribute {
  key: string;
  value: string;
  sort_order: number;
}

export interface ProductMetaTag {
  title: string;
  description: string;
  canonical_url: string;

  is_indexable: boolean;

  og_title: string;
  og_description: string;
  og_image: string;

  twitter_card:
    | "summary"
    | "summary_large_image"
    | "player"
    | "app"
    | string;
}



export interface ProductJsonLd {
  "@context": "https://schema.org";
  "@type": "Product";

  name: string;
  description: string;
  url: string;
  image: string[];

  brand: {
    "@type": "Brand";
    name: string;
  };

  category: string;

  offers: {
    "@type": "AggregateOffer";
    url: string;
    priceCurrency: string;
    lowPrice: string;
    highPrice: string;
    offerCount: number;
    availability: string;
  };
}

export interface BreadcrumbJsonLd {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";

  itemListElement: BreadcrumbItem[];
}

export interface BreadcrumbItem {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string;
}