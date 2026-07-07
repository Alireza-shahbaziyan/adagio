import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import { Product } from "@/types/singleProduct";
import type { Product as ProductSummary, ProductsResponse } from "@/types/products";

export function generateStaticParams() {
  return [];
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  const response = await fetch(`${baseUrl}/api/products/${slug}`,
    {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      cache: "no-store",
      next: {
        revalidate: 60 * 10, // 10 minutes
      },
    }
  );
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
          "Accept": "application/json",
        },
        cache: "no-store",
        next: {
          revalidate: 60 * 10,
        },
      }
    );
    if (listResponse.ok) {
      const list = (await listResponse.json()) as ProductsResponse;
      recommended = (list.results ?? []).filter((p) => p.slug !== slug).slice(0, 3);
    }
  } catch {
    recommended = [];
  }

  return <ProductDetail product={product} recommended={recommended} />;
}
