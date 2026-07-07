import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import StoreView from "@/components/StoreView";
import {
  getCollectionBySlug,
  getStoreCollections,
  getStoreProducts,
  parsePageParam,
} from "@/lib/store";
import { frontend } from "@/utils/getURL";

type SearchParams = Promise<{
  featured?: string;
  search?: string;
  ordering?: string;
  page?: string;
}>;

export async function generateStaticParams() {
  const collections = await getStoreCollections();
  return collections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection) return { title: "کالکشن پیدا نشد | آداجیو" };

  const title = `${collection.title} | فروشگاه آداجیو`;
  const description = collection.short_description || `محصولات کالکشن ${collection.title} را در فروشگاه آداجیو مرور کن.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${frontend}/store/collection/${collection.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${frontend}/store/collection/${collection.slug}`,
    },
  };
}

export default async function StoreCollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const searchParamsValue = await searchParams;

  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const [collections, products] = await Promise.all([
    getStoreCollections(),
    getStoreProducts({ ...searchParamsValue, collectionSlug: slug }),
  ]);

  return (
    <div dir="rtl" lang="fa" className="relative min-h-screen bg-[#090909] pb-24 text-white md:pb-0">
      <Navbar variant="default" />
      <StoreView
        eyebrow="کالکشن"
        title={collection.title}
        description={collection.short_description}
        breadcrumb={[
          { label: "خانه", href: "/" },
          { label: "فروشگاه", href: "/store" },
          { label: collection.title },
        ]}
        collections={collections}
        activeCollectionSlug={collection.slug}
        products={products}
        currentPage={parsePageParam(searchParamsValue.page)}
        queryState={{
          search: searchParamsValue.search,
          ordering: searchParamsValue.ordering,
          featured: searchParamsValue.featured,
          page: searchParamsValue.page,
        }}
      />
      <Footer mobileBottomPad />
      <MobileBottomNav />
    </div>
  );
}
