import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductPage/ProductDetail";
import { Product } from "@/types/singleProduct";
import type {
  Product as ProductSummary,
  ProductsResponse,
} from "@/types/products";
import { Metadata } from "next";
import { ProductJsonLd } from "@/components/seo/ProductJsonLd";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

async function getProduct(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const res = await fetch(`${baseUrl}/api/products/${slug}`, {
    next: {
      revalidate: 3600,
    },
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const product: Product = await getProduct(slug);
  const meta = product.meta_tag;
  if (!product) {
    return {
      title: "محصول پیدا نشد | آداجیو",
    };
  }
  return {
    title: meta.title ?? "تیشرت باکسی اورسایز | ADAGIO",

    description: meta.description??"تیشرت باکسی اورسایز | ADAGIO",

    alternates: {
      canonical: meta.canonical_url??`https://adagiostyle.ir/store/products/${product.slug}`,
    },

    robots: {
      index: meta.is_indexable??false,
      follow: meta.is_indexable ??false,
    },

    openGraph: {
      title: meta.og_title??"تیشرت باکسی اورسایز | ADAGIO",
      description: meta.og_description??"تیشرت باکسی اورسایز | ADAGIO",
      url: meta.canonical_url??`https://adagiostyle.ir/store/products/${product.slug}`,
      type: "website",

      images: [
        {
          url: meta.og_image??null,
          alt: product.title ??null,
        },
      ],
    },

    twitter: {
      card:
        meta.twitter_card === "summary_large_image"
          ? "summary_large_image"
          : "summary",

      title: meta.og_title,
      description: meta.og_description,

      images: [meta.og_image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  const response = await fetch(`${baseUrl}/api/products/${slug}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    cache: "no-store",
  });
  if (!response.ok) notFound();
  const product = (await response.json()) as Product;
  if (!product) notFound();

  let recommended: ProductSummary[] = [];

  try {
    const listResponse = await fetch(
      `${baseUrl}/api/products/?page=1&page_size=4`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        next: {
          revalidate: 60 * 10,
        },
      },
    );
    if (listResponse.ok) {
      const list = (await listResponse.json()) as ProductsResponse;
      recommended = (list.results ?? [])
        .filter((p) => p.slug !== slug)
        .slice(0, 3);
    }
  } catch {
    recommended = [];
  }

  return (
    <>
      <ProductJsonLd product={product} />
      <ProductDetail product={product} recommended={recommended} />;
    </>
  );
}
