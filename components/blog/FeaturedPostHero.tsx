import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/types/posts";
import { formatDate } from "./formatDate";

/**
 * Large editorial hero for the single featured post of the blog index,
 * giving the listing a clear visual entry point above the card grid.
 */
export default function FeaturedPostHero({ post }: { post: Post }) {
  return (
    <article className="group mb-10 md:mb-14">
      <Link
        href={`/blog/${post.slug}`}
        className="grid overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500 hover:border-white/20 hover:shadow-[0_16px_48px_rgba(0,0,0,0.35)] md:grid-cols-2"
      >
        <div className="relative aspect-16/10 overflow-hidden bg-muted md:aspect-auto md:min-h-[360px]">
          {post.featured_image ? (
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover grayscale-0 md:grayscale transition-transform duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
            />
          ) : (
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-br from-white/8 via-transparent to-transparent"
            />
          )}

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-70"
          />

          <span className="absolute right-4 top-4 rounded-full border border-white/25 bg-white/90 px-3 py-1 text-xs font-bold text-black backdrop-blur-md">
            پست ویژه
          </span>
        </div>

        <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {post.category && (
              <span className="rounded-full border border-border px-3 py-1">
                {post.category}
              </span>
            )}

            <time dateTime={post.published_at}>
              {formatDate(post.published_at)}
            </time>
          </div>

          <h3 className="text-2xl font-black leading-[1.5] text-foreground md:text-4xl">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="line-clamp-3 text-sm leading-loose text-muted-foreground md:text-base">
              {post.excerpt}
            </p>
          )}

          <div className="mt-2 flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
              مطالعه مقاله
            </span>

            <span
              aria-hidden="true"
              className="text-lg text-muted-foreground transition-transform duration-300 group-hover:-translate-x-1"
            >
              ←
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
