import type { Metadata } from "next";
import Link from "next/link";

import BlogPostCard from "@/components/blog/BlogPostCard";
import FeaturedPostHero from "@/components/blog/FeaturedPostHero";
import PopularPostItem from "@/components/blog/PopularPostItem";
import { Post, PostsResponse } from "@/types/posts";
import SectionHeader from "@/components/blog/SectionHeader";
import EmptyState from "@/components/blog/EmptyState";
import { referer } from "@/utils/getURL";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/blog/posts/`;

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = {
  title: "مجله آداجیو | مقالات موسیقی، مد و فرهنگ پاپ",
  description:
    "مجله آداجیو؛ مجموعه‌ای از مقالات درباره موسیقی، هنرمندان، فرهنگ پاپ، استایل و داستان پشت محصولات آداجیو.",
  alternates: {
    canonical: `${referer}/blog`,
  },
  openGraph: {
    title: "مجله آداجیو | موسیقی، مد و فرهنگ پاپ",
    description:
      "مقالات آداجیو درباره موسیقی، هنرمندان، فرهنگ پاپ و استایل.",
    url: `${referer}/blog`,
    siteName: "ADAGIO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "مجله آداجیو | موسیقی، مد و فرهنگ پاپ",
    description:
      "مقالات آداجیو درباره موسیقی، هنرمندان، فرهنگ پاپ و استایل.",
  },
};

async function getPosts(
  params: Record<string, string>
): Promise<Post[]> {
  const searchParams = new URLSearchParams({
    page: "1",
    ...params,
  });

  try {
    const response = await fetch(`${API_URL}?${searchParams.toString()}`, {
      cache: "force-cache",
    });

    if (!response.ok) {
      return [];
    }

    const data: PostsResponse = await response.json();

    return data.results ?? [];
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const [
    latestPosts,
    popularPosts,
    tshirtPosts,
    featuredPosts,
    weeklyBestPosts,
  ] = await Promise.all([
    getPosts({
      ordering: "-published_at",
    }),

    getPosts({
      ordering: "-view_count",
    }),

    getPosts({
      category: "تیشرت",
      ordering: "-published_at",
    }),

    getPosts({
      featured: "true",
    }),

    getPosts({
      period: "week",
    }),
  ]);

  const allPosts = [
    ...latestPosts,
    ...popularPosts,
    ...tshirtPosts,
    ...featuredPosts,
    ...weeklyBestPosts,
  ];

  const uniquePosts = Array.from(
    new Map(allPosts.map((post) => [post.id, post])).values()
  );

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "مجله آداجیو",
    description:
      "مجله آداجیو درباره موسیقی، فرهنگ پاپ، هنرمندان، استایل و داستان محصولات.",
    url: `${referer}/blog`,
    publisher: {
      "@type": "Organization",
      name: "ADAGIO",
      url: referer,
    },
    blogPost: uniquePosts.slice(0, 20).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: `${referer}/blog/${post.slug}`,
      image: post.featured_image,
      datePublished: post.published_at,
      author: {
        "@type": "Person",
        name: post.author,
      },
    })),
  };

  // The first featured post becomes the editorial hero of the page.
  const heroPost = featuredPosts[0] ?? null;
  const remainingFeatured = heroPost ? featuredPosts.slice(1, 6) : [];

  const discoveryChipClass =
    "rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-white/30 hover:text-foreground";

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogJsonLd),
        }}
      />

      {/* Hero */}
      <section
        aria-labelledby="blog-title"
        className="relative overflow-hidden border-b border-border"
      >
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-20 md:px-8 md:pb-20 md:pt-20 lg:pb-24">
          <div className="max-w-4xl">
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
              ADAGIO / JOURNAL
            </p>

            <h1
              id="blog-title"
              className="max-w-4xl text-4xl font-black leading-[1.25] tracking-tight md:text-6xl lg:text-7xl"
            >
              مجله آداجیو
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-[2] text-muted-foreground md:text-lg">
              جایی برای کشف داستان‌های موسیقی، هنرمندان، فرهنگ پاپ،
              استایل و چیزهایی که الهام‌بخش جهان آداجیو هستند.
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-white/[0.025] blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-white/[0.02] blur-3xl"
        />
      </section>

      {/* Section discovery */}
      <nav
        aria-label="بخش‌های مجله"
        className="border-b border-border bg-card/20"
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-5 py-6 md:px-8">
          {featuredPosts.length > 0 && (
            <a href="#featured-posts" className={discoveryChipClass}>
              ویژه
            </a>
          )}
          {weeklyBestPosts.length > 0 && (
            <a href="#weekly-best-posts" className={discoveryChipClass}>
              بهترین‌های هفته
            </a>
          )}
          <a href="#latest-posts" className={discoveryChipClass}>
            جدیدترین
          </a>
          {popularPosts.length > 0 && (
            <a href="#popular-posts" className={discoveryChipClass}>
              محبوب‌ترین
            </a>
          )}
          {tshirtPosts.length > 0 && (
            <a href="#tshirt-posts" className={discoveryChipClass}>
              تیشرت
            </a>
          )}
        </div>
      </nav>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section
          id="featured-posts"
          aria-labelledby="featured-posts-title"
          className="scroll-mt-24 border-b border-border bg-card/30"
        >
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
            <SectionHeader
              eyebrow="EDITOR'S PICKS"
              title="پست‌های ویژه"
              description="منتخب مقالات مجله آداجیو؛ مطالبی که برای کشف موسیقی، هنرمندان و فرهنگ پاپ پیشنهاد می‌کنیم."
            />

            {heroPost && <FeaturedPostHero post={heroPost} />}

            {remainingFeatured.length > 0 && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
                {remainingFeatured.map((post) => (
                  <BlogPostCard key={post.id} post={post} featured />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Weekly Best */}
      {weeklyBestPosts.length > 0 && (
        <section
          id="weekly-best-posts"
          aria-labelledby="weekly-best-posts-title"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 md:px-8 md:py-24"
        >
          <SectionHeader
            eyebrow="BEST OF THE WEEK"
            title="بهترین‌های هفته"
            description="مقالاتی که در این هفته ارزش خواندن دارند؛ از داستان هنرمندان تا موسیقی و فرهنگ پاپ."
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {weeklyBestPosts.slice(0, 6).map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Latest */}
      <section
        id="latest-posts"
        aria-labelledby="latest-posts-title"
        className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 md:px-8 md:py-24"
      >
        <SectionHeader
          eyebrow="LATEST"
          title="جدیدترین مقالات"
          description="تازه‌ترین نوشته‌های مجله آداجیو درباره موسیقی، فرهنگ و استایل."
        />

        {latestPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {latestPosts.slice(0, 6).map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </section>

      {/* Popular */}
      {popularPosts.length > 0 && (
        <section
          id="popular-posts"
          aria-labelledby="popular-posts-title"
          className="scroll-mt-24 border-y border-border bg-card/30"
        >
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
            <SectionHeader
              eyebrow="MOST READ"
              title="محبوب‌ترین مقالات"
              description="مقالاتی که بیشتر از همه توسط مخاطبان آداجیو خوانده شده‌اند."
            />

            <ol className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
              {popularPosts.slice(0, 6).map((post, index) => (
                <PopularPostItem
                  key={post.id}
                  post={post}
                  rank={index + 1}
                />
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* T-Shirts */}
      {tshirtPosts.length > 0 && (
        <section
          id="tshirt-posts"
          aria-labelledby="tshirt-posts-title"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 md:px-8 md:py-24"
        >
          <SectionHeader
            eyebrow="T-SHIRTS"
            title="مقالات مرتبط با تیشرت"
            description="داستان‌ها، الهام‌ها و مطالب مرتبط با تیشرت‌های آداجیو."
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {tshirtPosts.slice(0, 6).map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Editorial CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <div className="relative overflow-hidden rounded-[var(--radius-2xl)] border border-border bg-card px-6 py-14 text-center md:px-12 md:py-20">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_60%)]"
            />

            <div className="relative mx-auto max-w-2xl">
              <p className="mb-4 text-xs tracking-[0.3em] text-muted-foreground">
                THE ADAGIO STORY
              </p>

              <h2 className="text-3xl font-black leading-tight md:text-5xl">
                هر محصول، یک داستان دارد.
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-[2] text-muted-foreground md:text-base">
                آداجیو از موسیقی، هنر و فرهنگ پاپ الهام می‌گیرد؛
                داستان این الهام‌ها را در مجله ما دنبال کنید.
              </p>

              <Link
                href="/store"
                className="mt-8 inline-flex rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
              >
                مشاهده محصولات
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
