import type { Metadata } from "next";
import Link from "next/link";

import BlogPostCard from "@/components/blog/BlogPostCard";
import { Post, PostsResponse } from "@/types/posts";
import SectionHeader from "@/components/blog/SectionHeader";
import EmptyState from "@/components/blog/EmptyState";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/blog/posts/`;

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = {
  title: "مجله آداجیو | مقالات موسیقی، مد و فرهنگ پاپ",
  description:
    "مجله آداجیو؛ مجموعه‌ای از مقالات درباره موسیقی، هنرمندان، فرهنگ پاپ، استایل و داستان پشت محصولات آداجیو.",
  alternates: {
    canonical: "https://adagiostyle.ir/blog",
  },
  openGraph: {
    title: "مجله آداجیو | موسیقی، مد و فرهنگ پاپ",
    description:
      "مقالات آداجیو درباره موسیقی، هنرمندان، فرهنگ پاپ و استایل.",
    url: "https://adagiostyle.ir/blog",
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
  const [latestPosts, popularPosts, tshirtPosts] = await Promise.all([
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
  ]);

  const allPosts = [
    ...latestPosts,
    ...popularPosts,
    ...tshirtPosts,
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
    url: "https://adagiostyle.ir/blog",
    publisher: {
      "@type": "Organization",
      name: "ADAGIO",
      url: "https://adagiostyle.ir",
    },
    blogPost: uniquePosts.slice(0, 20).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: `https://adagiostyle.ir/blog/${post.slug}`,
      image: post.featured_image,
      datePublished: post.published_at,
      author: {
        "@type": "Person",
        name: post.author,
      },
    })),
  };

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

      {/* Latest */}
      <section
        aria-labelledby="latest-posts-title"
        className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24"
      >
        <SectionHeader
          eyebrow="LATEST"
          title="جدیدترین مقالات"
          description="تازه‌ترین نوشته‌های مجله آداجیو درباره موسیقی، فرهنگ و استایل."
        />

        {latestPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
          aria-labelledby="popular-posts-title"
          className="border-y border-border bg-card/30"
        >
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
            <SectionHeader
              eyebrow="MOST READ"
              title="محبوب‌ترین مقالات"
              description="مقالاتی که بیشتر از همه توسط مخاطبان آداجیو خوانده شده‌اند."
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {popularPosts.slice(0, 6).map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* T-Shirts */}
      {tshirtPosts.length > 0 && (
        <section
          aria-labelledby="tshirt-posts-title"
          className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24"
        >
          <SectionHeader
            eyebrow="T-SHIRTS"
            title="مقالات مرتبط با تیشرت"
            description="داستان‌ها، الهام‌ها و مطالب مرتبط با تیشرت‌های آداجیو."
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tshirtPosts.slice(0, 6).map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/blog/category/t-shirts"
              className="group inline-flex items-center gap-3 rounded-full border border-border px-6 py-3 text-sm font-medium transition-all duration-300 hover:border-white/30 hover:bg-white/[0.04]"
            >
              <span>مشاهده همه مقالات تیشرت</span>

              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-x-1"
              >
                ←
              </span>
            </Link>
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



