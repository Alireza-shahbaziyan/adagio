import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductPage/ProductDetail";
import { Product } from "@/types/singleProduct";
import type {
  Product as ProductSummary,
  ProductsResponse,
} from "@/types/products";
import { Metadata } from "next";
import { frontend } from "@/utils/getURL";

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

  const product:Product = await getProduct(slug);

  if (!product) {
    return {
      title: "محصول پیدا نشد | آداجیو",
  
    };
  }
  return {
    title: `${product.title} | خرید تیشرت آداجیو`,
    description: `خرید ${product.title} با طراحی مینیمال، پارچه نخی باکیفیت و چاپ ماندگار از فروشگاه آداجیو. مشاهده جزئیات محصول و ثبت سفارش.`,
    alternates: {
      canonical: `${frontend}/products/${product.slug}`,
    },

    openGraph: {
      title: `${product.title} | آداجیو`,
      description: `خرید ${product.title} با طراحی خاص موسیقی از فروشگاه آداجیو.`,
      url: `/products/${product.slug}`,
      // sitetitle: "Adagio",
      type: "website",
      images: [
        {
          url: product.images[0].image,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | آداجیو`,
      description: `تیشرت‌های موسیقی مینیمال با کیفیت بالا.`,
      images: [product.images[0].image],
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
    next: {
      revalidate: 60 * 10, // 10 minutes
    },
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

  return <ProductDetail product={product} recommended={recommended} />;
}
