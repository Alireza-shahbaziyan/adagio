import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
// import BestSellersCarousel from "@/components/BestSellersCarousel";
import NewsletterForm from "@/components/NewsletterForm";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
// import { PRODUCTS } from "@/lib/products";
import { ProductsResponse } from "@/types/products";
import { CustomerGalleryItem, GalleryResponse } from "@/types/gallery";
import { Metadata } from "next";
// import ErrorPage from "./error";

const REVIEWS = [
  {
    stars: "★★★★★",
    quote:
      "«کیفیت پارچه به‌تنهایی می‌ارزد. سایز اورسایز عالیه و طرح بعد از ماه‌ها هنوز رنگش نرفته.»",
    name: "مانا ت.",
  },
  {
    stars: "★★★★★",
    quote: "«انگار مرچ گروهی‌ست که هنوز وجود نداره. مدام می‌پوشمش.»",
    name: "دنیز ک.",
  },
  {
    stars: "★★★★★",
    quote:
      "«تیشرت کلاژ رو سفارش دادم، فکر کردم فقط یه تیشرته. یه اثر هنری تحویل گرفتم.»",
    name: "پریا س.",
  },
];

export const metadata: Metadata = {
  title: "آداجیو | خرید تیشرت موسیقی و طرح‌های مینیمال هنری",

  description:
    "فروشگاه آداجیو؛ خرید تیشرت‌های موسیقی با طراحی مینیمال و هنری، الهام گرفته از خوانندگان و گروه‌های محبوب. تیشرت‌های باکیفیت با چاپ ماندگار و ارسال سریع.",

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "آداجیو | تیشرت‌هایی که موسیقی را می‌پوشید",

    description:
      "تیشرت‌های مینیمال با الهام از دنیای موسیقی؛ طراحی خاص، کیفیت بالا و سبک متفاوت.",

    url: "/",

    siteName: "Adagio",

    locale: "fa_IR",

    type: "website",

    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Adagio Music T-Shirts",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "آداجیو | تیشرت‌های موسیقی مینیمال",

    description:
      "فروش تیشرت‌های هنری و موسیقی با طراحی خاص.",
  },
};

export default async function Home() {
  // get products from api
  const ProductResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/products/?featured=true&page=1&page_size=4`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      next: {
        revalidate: 60 * 60, // 1 hour
      },
    },
  );
  const GalleryResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/gallery/customers/?page=1&page_size=8`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      next: {
        revalidate: 60 * 60, // 1 hour
      },
    },
  );
  if (!ProductResponse.ok || !GalleryResponse.ok) {
    return <div>مشکلی پیش آمده دوباره امتحان کنید . </div>;
  }
  const products: ProductsResponse = await ProductResponse.json();
  const GalleryList: GalleryResponse = await GalleryResponse.json();

  return (
    <div
      dir="rtl"
      lang="fa"
      className="relative min-h-screen overflow-x-hidden bg-primary-foreground text-white"
    >
      <Navbar variant="home" />

      <Hero />

      <Reveal>
        <section
          id="slogan"
          className="relative z-1 bg-primary-foreground px-5 py-22.5 text-center md:px-20 md:py-40"
        >
          <h1 className="mx-auto mb-7   text-[38px] font-black leading-[1.2] text-foreground md:text-[96px]">
            موسیقی‌ای که می‌پوشی
          </h1>
          <p className="mx-auto mb-12 max-w-115 text-base leading-[1.8] text-muted-foreground md:text-xl">
            حال‌وهوای آهنگ‌های موردعلاقه‌ات را بپوش.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="#featured"
              className="inline-block rounded-full bg-foreground  px-10 py-4.5 text-[15px] font-bold tracking-[0.3px] text-primary-foreground transition-all hover:scale-[1.04] hover:shadow-[0_8px_30px_rgba(243,243,243,0.22)]"
            >
              مشاهده کالکشن
            </Link>
            <Link
              href="#story"
              className="inline-block rounded-full border border-white/35 bg-transparent px-10 py-4.5 text-[15px] font-medium tracking-[0.3px] text-foreground transition-colors hover:border-white/60 hover:bg-white/8"
            >
              کاوش
            </Link>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section
          id="featured"
          className="relative z-1 bg-primary-foreground  px-5 pb-16 pt-20 md:px-16 md:pb-32 md:pt-40"
        >
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-4 text-xs tracking-[1px] text-muted-foreground">
                این بخش
              </p>
              <h2 className="  text-[30px] font-black text-foreground md:text-[56px]">
                محصولات ویژه
              </h2>
            </div>
            <Link
              href="/store"
              className="whitespace-nowrap border-b border-white/25 pb-1 text-sm text-muted-foreground"
            >
              مشاهده همه محصولات
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.results.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                interactive
                priority={i === 0}
              />
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section id="categories" className="px-5 pb-20 md:px-16 md:pb-40">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-3xl">
              <Image
                src="/assets/img/blackT.jpg"
                alt="کالکشن مشکی"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.16,.8,.24,1)] group-hover:scale-[1.06]"
                style={{
                  objectPosition: "center 15%",
                  filter: "grayscale(1) brightness(0.55)",
                }}
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 40%, rgba(9,9,9,0.88) 100%)",
                }}
              />
              <div className="pointer-events-none absolute inset-x-8 bottom-8">
                <h3 className="mb-2   text-[26px] font-black text-foreground md:text-[36px]">
                  کالکشن مشکی
                </h3>
                <p className="text-sm text-muted-foreground">
                  طرح‌های تک‌رنگ روی پنبه‌ی مشکی سنگین
                </p>
              </div>
            </div>

            <div className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-3xl">
              <Image
                src="/assets/img/whiteT.jpg"
                alt="کالکشن سفید"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.16,.8,.24,1)] group-hover:scale-[1.06]"
                style={{
                  objectPosition: "center 15%",
                  filter: "grayscale(1) brightness(0.55)",
                }}
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 40%, rgba(9,9,9,0.88) 100%)",
                }}
              />
              <div className="pointer-events-none absolute inset-x-8 bottom-8">
                <h3 className="mb-2   text-[26px] font-black text-foreground md:text-[36px]">
                  کالکشن سفید
                </h3>
                <p className="text-sm text-muted-foreground">
                  طرح‌های تک‌رنگ روی پنبه‌ی سفید
                </p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section
          id="story"
          className="grid grid-cols-1 items-center gap-16 px-5 pb-20 md:grid-cols-2 md:px-16 md:pb-40"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Image
              src="/assets/tee-collage.avif"
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              style={{ filter: "grayscale(1) contrast(1.05) brightness(0.78)" }}
            />
          </div>
          <div>
            <p className="mb-6 text-xs tracking-[1px] text-muted-foreground">
              داستان ما
            </p>
            <h2 className="mb-8   text-[28px] font-black leading-[1.35] text-foreground md:text-[48px]">
              زاده‌ی ساعت‌های میان نیمه‌شب و خواب.
            </h2>
            <p className="max-w-120 text-base leading-loose text-muted-foreground">
              آداجیو از یک پلی‌لیست برای یک رانندگی طولانی شروع شد. هر طرح از
              همان حس می‌آید؛ خش‌خش رادیوی ماشین، دانه‌های یک نوار قدیمی، سکوت
              بعد از تمام‌شدن یک کنسرت. پالت را مشکی و سفید نگه می‌داریم تا
              حال‌وهوا حرف اول را بزند، نه رنگ.
            </p>
          </div>
        </section>
      </Reveal>

      {/* <BestSellersCarousel products={BEST_SELLERS} /> */}

      <Reveal>
        <section className="bg-[#111111] px-5 py-16 md:px-16 md:py-28">
          <h2 className="mb-14 text-center   text-[28px] font-black text-foreground md:text-[48px]">
            چه کسانی آن را پوشیده‌اند
          </h2>
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 md:grid-cols-3">
            {REVIEWS.map((r) => (
              <div key={r.name} className="rounded-[20px] bg-[#181818] p-8">
                <div
                  style={{ direction: "ltr", textAlign: "right" }}
                  className="mb-5 text-sm tracking-[2px] text-foreground"
                >
                  {r.stars}
                </div>
                <p className="mb-6 text-[15px] leading-[1.9] text-muted-foreground">
                  {r.quote}
                </p>
                <p className="text-sm text-foreground">{r.name}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="px-5 py-20 md:px-16 md:py-40">
          <div className="mb-14 text-center">
            <p
              style={{ direction: "ltr" }}
              className="mb-4 text-xs tracking-[1px] text-muted-foreground"
            >
              @adagio.wear
            </p>
            <h2 className="  text-[28px] font-black text-foreground md:text-[48px]">
              از میان مخاطبان
            </h2>
          </div>
          <div style={{ columns: "4 220px", columnGap: "20px" }}>
            {GalleryList.results.map((item: CustomerGalleryItem) => (
              <div
                key={item.id}
                style={{
                  breakInside: "avoid",
                  marginBottom: 20,
                  borderRadius: 16,
                  aspectRatio: "1 / 1",
                }}
                className="relative overflow-hidden bg-gray-100"
              >
                <Image
                  src={item.image}
                  alt={item.caption}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />

                {/* overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.35))",
                  }}
                />

                {/* caption */}
                <p className="absolute bottom-3 right-3 z-1 text-xs text-white">
                  {item.customer_name}
                </p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section
          id="newsletter"
          className="bg-[#111111] px-5 py-24 text-center md:px-16 md:py-44"
        >
          <p className="mb-6 text-xs tracking-[1px] text-muted-foreground">
            در سکوت شب بمان
          </p>
          <h2 className="mx-auto mb-10 max-w-200   text-[30px] font-black text-foreground md:text-[64px]">
            انتشار جدید، اولین شنیدن.
          </h2>
          <NewsletterForm />
        </section>
      </Reveal>

      <Footer mobileBottomPad />
      <MobileBottomNav />
    </div>
  );
}
