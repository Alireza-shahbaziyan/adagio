import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Post, PostDetail, PostsResponse } from "@/types/posts";

export const revalidate = 1800;

const API_URL = "https://api.adagiostyle.ir/api/blog/posts";
const SITE_URL = "https://adagiostyle.ir";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getPost(slug: string): Promise<PostDetail | null> {
  try {
    const response = await fetch(`${API_URL}/${slug}/`, {
      cache: "force-cache",
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch blog post");
    }

    return response.json();
  } catch {
    return null;
  }
}

async function getPostSlugs(): Promise<string[]> {
  try {
    const response = await fetch(`${API_URL}/`, {
      cache: "force-cache",
    });

    if (!response.ok) {
      return [];
    }

    const data: PostsResponse = await response.json();

    return data.results.map((post: Post) => post.slug);
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const slugs = await getPostSlugs();

  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;

  const post = await getPost(slug);

  if (!post) {
    return {
      title: "مقاله پیدا نشد | آداجیو",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const meta = post.meta_tag??null;
  if (!meta) {
    return {
      title: post.title,
      description: post.excerpt,
    };
  }

  const canonical = meta.canonical_url || `${SITE_URL}/blog/${post.slug}`;

  return {
    title: meta.title || post.title,

    description: meta.description || post.excerpt,

    robots: {
      index: meta.is_indexable,
      follow: true,
    },

    alternates: {
      canonical,
    },

    openGraph: {
      type: "article",
      url: canonical,
      title: meta.og_title || meta.title || post.title,
      description: meta.og_description || meta.description || post.excerpt,

      images: [
        {
          url: meta.og_image || post.featured_image,
          alt: post.title,
        },
      ],

      publishedTime: post.published_at,
      modifiedTime: post.updated_at,

      authors: [post.author],
    },

    twitter: {
      card:
        (meta.twitter_card as "summary" | "summary_large_image") ||
        "summary_large_image",

      title: meta.og_title || meta.title || post.title,

      description: meta.og_description || meta.description || post.excerpt,

      images: [meta.og_image || post.featured_image],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* JSON-LD */}
      <StructuredData data={post.json_ld} />

      <StructuredData data={post.breadcrumb_ld} />

      {/* Article Header */}
      <article>
        <header className="mx-auto max-w-5xl px-5 pb-12 pt-20 md:px-8 md:pb-10 md:pt-13">
          {/* Breadcrumb */}
          <nav aria-label="مسیر صفحه" className="mb-10">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-foreground"
                >
                  خانه
                </Link>
              </li>

              <li aria-hidden="true">/</li>

              <li>
                <Link
                  href="/blog"
                  className="transition-colors hover:text-foreground"
                >
                  مجله آداجیو
                </Link>
              </li>

              <li aria-hidden="true">/</li>

              <li className="text-foreground">{post.category}</li>
            </ol>
          </nav>

          {/* Category */}
          <div className="mb-5">
            <span className="inline-flex rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="max-w-4xl text-4xl font-black leading-[1.35] tracking-tight md:text-6xl">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="mt-6 max-w-3xl text-base leading-[2] text-muted-foreground md:text-lg">
              {post.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-muted-foreground">
            <span>
              نویسنده:{" "}
              <strong className="font-medium text-foreground">
                {post.author}
              </strong>
            </span>

            <span
              aria-hidden="true"
              className="h-1 w-1 rounded-full bg-muted-foreground/50"
            />

            <time dateTime={post.published_at}>
              {formatDate(post.published_at)}
            </time>

            {post.updated_at !== post.published_at && (
              <>
                <span
                  aria-hidden="true"
                  className="h-1 w-1 rounded-full bg-muted-foreground/50"
                />

                <span>بروزرسانی: {formatDate(post.updated_at)}</span>
              </>
            )}

            <span
              aria-hidden="true"
              className="h-1 w-1 rounded-full bg-muted-foreground/50"
            />

            <span>{post.view_count.toLocaleString("fa-IR")} بازدید</span>
          </div>
        </header>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-2xl)] border border-border bg-card">
              <Image
                src={post.featured_image}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
          <div
            className="
              prose
              prose-invert
              max-w-none

              text-[16px]
              leading-[2.2]
              text-foreground/90

              prose-headings:font-black
              prose-headings:leading-[1.5]
              prose-headings:text-foreground

              prose-h2:mt-14
              prose-h2:text-3xl

              prose-h3:mt-10
              prose-h3:text-2xl

              prose-p:my-6

              prose-a:text-foreground
              prose-a:underline
              prose-a:underline-offset-4

              prose-strong:text-foreground

              prose-blockquote:border-white/20
              prose-blockquote:text-muted-foreground

              prose-img:rounded-[var(--radius-xl)]
              prose-img:border
              prose-img:border-border

              prose-li:marker:text-muted-foreground

              md:text-[17px]
            "
            dangerouslySetInnerHTML={{
              __html: post.content_html,
            }}
          />
        </div>

        {/* Media */}
        {post.media?.length > 0 && (
          <section
            aria-labelledby="article-media-title"
            className="mx-auto max-w-5xl px-5 pb-20 md:px-8"
          >
            <h2 id="article-media-title" className="mb-8 text-2xl font-black">
              تصاویر مقاله
            </h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {post.media.map((media) => {
                if (media.is_video === true || media.is_video === "true") {
                  return (
                    <video
                      key={media.id}
                      controls
                      preload="metadata"
                      className="w-full rounded-[var(--radius-xl)] border border-border"
                    >
                      <source src={media.file} />
                    </video>
                  );
                }

                return (
                  <div
                    key={media.id}
                    className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card"
                  >
                    <Image
                      src={media.file}
                      alt={media.alt_text || post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="border-t border-border">
          <div className="mx-auto flex max-w-3xl flex-col gap-6 px-5 py-12 md:flex-row md:items-center md:justify-between md:px-8">
            <div>
              <p className="text-xs text-muted-foreground">دسته‌بندی</p>

              <p className="mt-1 font-bold">{post.category}</p>
            </div>

            <Link
              href="/blog"
              className="inline-flex w-fit items-center gap-3 rounded-full border border-border px-5 py-3 text-sm transition-colors hover:bg-white/[0.04]"
            >
              <span>بازگشت به مجله</span>

              <span aria-hidden="true">←</span>
            </Link>
          </div>
        </footer>
      </article>
    </main>
  );
}

function StructuredData({ data }: { data: Record<string, unknown> }) {
  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}

function formatDate(date: string | null | undefined) {
  const parsedDate = date ? new Date(date) : null;

  if (!parsedDate || Number.isNaN(parsedDate.getTime())) {
    return "تاریخ نامشخص";
  }

  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsedDate);
}
