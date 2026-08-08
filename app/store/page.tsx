import type { Metadata } from "next";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import StoreView from "@/components/StoreView";
import {
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

export const metadata: Metadata = {
  title: "فروشگاه | آداجیو",
  description:
    "همه‌ی محصولات آداجیو را مرور کن و بر اساس کالکشن، محصولات ویژه یا جستجو فیلتر کن.",
  alternates: {
    canonical: `${frontend}/store`,
  },
  openGraph: {
    title: "فروشگاه | آداجیو",
    description:
      "همه‌ی محصولات آداجیو را مرور کن و بر اساس کالکشن، محصولات ویژه یا جستجو فیلتر کن.",
    url: `${frontend}/store`,
  },
};

export default async function StorePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const [collections, products] = await Promise.all([
    getStoreCollections(),
    getStoreProducts(params),
  ]);

  return (
    <div
      dir="rtl"
      lang="fa"
      className="relative min-h-screen bg-light-in-dark
     pb-24 text-white md:pb-0"
    >
      <Navbar variant="default" />
      <StoreView
        eyebrow="آرشیو"
        title="فروشگاه لباس خاص و مینیمال آداجیو"
        description=" موسیقی را به تن کن "
        breadcrumb={[{ label: "خانه", href: "/" }, { label: "فروشگاه" }]}
        collections={collections}
        products={products}
        currentPage={parsePageParam(params.page)}
        queryState={{
          search: params.search,
          ordering: params.ordering,
          featured: params.featured,
          page: params.page,
        }}
      />
      <Footer mobileBottomPad />
      <MobileBottomNav />
    </div>
  );
}
