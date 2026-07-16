import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import CollectionsShowcase from "@/components/Collection/CollectionsShowcase";
import { CollectionResponse } from "@/types/collections";
import { backend } from "@/utils/getURL";

type SearchParams = Promise<{
  page?: string;
  page_size?: string;
  search?: string;
  ordering?: string;
}>;

export default async function CollectionsPage({
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

  const res = await fetch(`${backend}/api/collections/?${query.toString()}`, {
    next: {
      revalidate: 60 * 60,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch collections");
  }

  const collectionResponse: CollectionResponse = await res.json();
  const pageSize = Number(page_size) || 20;
  const currentPage = Number(page) || 1;

  return (
    <div
      dir="rtl"
      lang="fa"
      className="relative min-h-screen bg-primary-foreground pb-24 text-white md:pb-0"
    >
      <Navbar variant="default" />
      <CollectionsShowcase
        collections={collectionResponse.results}
        totalCount={collectionResponse.count}
        startIndex={(currentPage - 1) * pageSize}
        search={search}
      />
      <Footer mobileBottomPad />
      <MobileBottomNav />
    </div>
  );
}
