// import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
// import BestSellersCarousel from "@/components/BestSellersCarousel";
// import NewsletterForm from "@/components/NewsletterForm";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
// import { PRODUCTS } from "@/lib/products";
import { ProductsResponse } from "@/types/products";


// const REVIEWS = [
//   {
//     stars: "★★★★★",
//     quote:
//       "«کیفیت پارچه به‌تنهایی می‌ارزد. سایز اورسایز عالیه و طرح بعد از ماه‌ها هنوز رنگش نرفته.»",
//     name: "مانا ت.",
//   },
//   {
//     stars: "★★★★★",
//     quote: "«انگار مرچ گروهی‌ست که هنوز وجود نداره. مدام می‌پوشمش.»",
//     name: "دنیز ک.",
//   },
//   {
//     stars: "★★★★★",
//     quote:
//       "«تیشرت کلاژ رو سفارش دادم، فکر کردم فقط یه تیشرته. یه اثر هنری تحویل گرفتم.»",
//     name: "پریا س.",
//   },
// ];



export default async function Home() {
  // get products from api
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/products/?featured=true&page=1&page_size=4`, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    cache: "no-store",
    next: {
      revalidate: 60 * 60, // 1 hour
    },
  });
  const products: ProductsResponse = await response.json() as ProductsResponse;
  return (
    <div
      dir="rtl"
      lang="fa"
      className="relative min-h-screen overflow-x-hidden bg-[#090909] text-white"
    >
      <Navbar variant="home" />

      <Hero />

      <Reveal>
        <section
          id="slogan"
          className="relative z-[1] bg-[#090909] px-5 py-[90px] text-center md:px-20 md:py-40"
        >
          <h1 className="mx-auto mb-7   text-[38px] font-black leading-[1.2] text-[#F3F3F3] md:text-[96px]">
            موسیقی‌ای که می‌پوشی
          </h1>
          <p className="mx-auto mb-12 max-w-[460px] text-base leading-[1.8] text-[#A8A8A8] md:text-xl">
            حال‌وهوای آهنگ‌های موردعلاقه‌ات را بپوش.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="#featured"
              className="inline-block rounded-full bg-[#F3F3F3] px-10 py-[18px] text-[15px] font-bold tracking-[0.3px] text-[#090909] transition-all hover:scale-[1.04] hover:shadow-[0_8px_30px_rgba(243,243,243,0.22)]"
            >
              مشاهده کالکشن
            </Link>
            <Link
              href="#story"
              className="inline-block rounded-full border border-white/[0.35] bg-transparent px-10 py-[18px] text-[15px] font-medium tracking-[0.3px] text-[#F3F3F3] transition-colors hover:border-white/60 hover:bg-white/[0.08]"
            >
              کاوش
            </Link>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section
          id="featured"
          className="relative z-[1] bg-[#090909] px-5 pb-16 pt-20 md:px-16 md:pb-32 md:pt-40"
        >
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-4 text-xs tracking-[1px] text-[#A8A8A8]">
                این بخش
              </p>
              <h2 className="  text-[30px] font-black text-[#F3F3F3] md:text-[56px]">
                محصولات ویژه
              </h2>
            </div>
            <Link
              href="/store"
              className="whitespace-nowrap border-b border-white/25 pb-1 text-sm text-[#A8A8A8]"
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
{/* 
      <Reveal>
        <section id="categories" className="px-5 pb-20 md:px-16 md:pb-40">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-3xl">
              <Image
                src="/assets/tee-feather.webp"
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
                <h3 className="mb-2   text-[26px] font-black text-[#F3F3F3] md:text-[36px]">
                  کالکشن مشکی
                </h3>
                <p className="text-sm text-[#A8A8A8]">
                  طرح‌های تک‌رنگ روی پنبه‌ی مشکی سنگین
                </p>
              </div>
            </div>

            <div
              className="relative aspect-[3/4] cursor-pointer overflow-hidden rounded-3xl"
              style={{
                background: "linear-gradient(160deg, #1c1c1c, #0d0d0d)",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(135deg, rgba(243,243,243,0.05) 0px, rgba(243,243,243,0.05) 2px, transparent 2px, transparent 14px)",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-[13px] text-[#5a5a5a]">
                  عکس محصول — تیشرت سفید
                </p>
              </div>
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 40%, rgba(9,9,9,0.9) 100%)",
                }}
              />
              <div className="pointer-events-none absolute inset-x-8 bottom-8">
                <h3 className="mb-2   text-[26px] font-black text-[#F3F3F3] md:text-[36px]">
                  کالکشن سفید
                </h3>
                <p className="text-sm text-[#A8A8A8]">
                  طرح‌های محوشده روی پنبه‌ی سفید پرمیوم
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
            <p className="mb-6 text-xs tracking-[1px] text-[#A8A8A8]">
              داستان ما
            </p>
            <h2 className="mb-8   text-[28px] font-black leading-[1.35] text-[#F3F3F3] md:text-[48px]">
              زاده‌ی ساعت‌های میان نیمه‌شب و خواب.
            </h2>
            <p className="max-w-[480px] text-base leading-[2] text-[#A8A8A8]">
              آداجیو از یک پلی‌لیست برای یک رانندگی طولانی شروع شد. هر طرح از
              همان حس می‌آید؛ خش‌خش رادیوی ماشین، دانه‌های یک نوار قدیمی، سکوت
              بعد از تمام‌شدن یک کنسرت. پالت را مشکی و سفید نگه می‌داریم تا
              حال‌وهوا حرف اول را بزند، نه رنگ.
            </p>
          </div>
        </section>
      </Reveal>

      <BestSellersCarousel products={BEST_SELLERS} />

      <Reveal>
        <section className="bg-[#111111] px-5 py-16 md:px-16 md:py-28">
          <h2 className="mb-14 text-center   text-[28px] font-black text-[#F3F3F3] md:text-[48px]">
            چه کسانی آن را پوشیده‌اند
          </h2>
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 md:grid-cols-3">
            {REVIEWS.map((r) => (
              <div key={r.name} className="rounded-[20px] bg-[#181818] p-8">
                <div
                  style={{ direction: "ltr", textAlign: "right" }}
                  className="mb-5 text-sm tracking-[2px] text-[#F3F3F3]"
                >
                  {r.stars}
                </div>
                <p className="mb-6 text-[15px] leading-[1.9] text-[#A8A8A8]">
                  {r.quote}
                </p>
                <p className="text-sm text-[#F3F3F3]">{r.name}</p>
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
              className="mb-4 text-xs tracking-[1px] text-[#A8A8A8]"
            >
              @adagio.wear
            </p>
            <h2 className="  text-[28px] font-black text-[#F3F3F3] md:text-[48px]">
              از میان مخاطبان
            </h2>
          </div>
          <div style={{ columns: "4 220px", columnGap: "20px" }}>
            {GALLERY_ITEMS.map((g, i) => (
              <div
                key={i}
                style={{
                  breakInside: "avoid",
                  marginBottom: 20,
                  borderRadius: 16,
                  background: g.bg,
                  aspectRatio: g.ratio,
                }}
                className="relative flex items-center justify-center overflow-hidden"
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 2px, transparent 2px, transparent 16px)",
                  }}
                />
                <p className="z-[1] text-xs text-[#555555]">عکس کاربر</p>
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
          <p className="mb-6 text-xs tracking-[1px] text-[#A8A8A8]">
            در سکوت شب بمان
          </p>
          <h2 className="mx-auto mb-10 max-w-[800px]   text-[30px] font-black text-[#F3F3F3] md:text-[64px]">
            انتشار جدید، اولین شنیدن.
          </h2>
          <NewsletterForm />
        </section>
      </Reveal> */}

      <Footer mobileBottomPad/>
      <MobileBottomNav />
    </div>
  );
}
