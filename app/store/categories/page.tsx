import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import CollectionsShowcase from "@/components/Collection/CollectionsShowcase";
import { CollectionResponse } from "@/types/collections";
import { backend, frontend } from "@/utils/getURL";
import { Metadata } from "next";

type SearchParams = Promise<{
  page?: string;
  page_size?: string;
  search?: string;
  ordering?: string;
}>;

export const metadata: Metadata = {
  title: "دسته‌بندی پوشاک و محصولات هنری آداجیو",
  description:
    "دسته‌بندی پوشاک و محصولات هنری آداجیو | Adagio",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${frontend}/collections`,
  },
  openGraph: {
    title: `دسته‌بندی پوشاک و محصولات هنری آداجیو`,
    description: `جدیدترین پوشاک و محصولات هنری با طراحی خاص و کیفیت بالا در فروشگاه آداجیو.`,
    url: `${frontend}/collections`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `دسته‌بندی پوشاک و محصولات هنری آداجیو`,
    description: `جدیدترین پوشاک و محصولات هنری با طراحی خاص و کیفیت بالا در فروشگاه آداجیو.`,
  },
};

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page, page_size, search, ordering } = await searchParams;

  const query = new URLSearchParams({
    ordering: ordering || "slug",
    page: page || "1",
    page_size: page_size || "20",
  });
  if (search) query.set("search", search);

  const res = await fetch(`${backend}/api/categories/?${query.toString()}`, {
  });

  if (!res.ok) {
    throw new Error("Failed to fetch collections");
  }

  const CategoriesResponse: CollectionResponse = await res.json();
  // const pageSize = Number(page_size) || 20;
  // const currentPage = Number(page) || 1;

  return (
    <div
      dir="rtl"
      lang="fa"
      className="relative min-h-screen bg-primary-foreground pb-24 text-white md:pb-0"
    >
      <Navbar variant="default" />
      <CollectionsShowcase
      h1="دسته‌بندی پوشاک و محصولات هنری آداجیو"
        collections={CategoriesResponse.results}
        // totalCount={CategoriesResponse.count}
        // startIndex={(currentPage - 1) * pageSize}
        search={search}
      />
      <Footer mobileBottomPad />
      <MobileBottomNav />
    </div>
  );
}
