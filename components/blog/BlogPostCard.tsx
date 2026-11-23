import { Post } from "@/types/posts";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "./formatDate";

export default function BlogPostCard({
  post,
  featured = false,
}: {
  post: Post;
  featured?: boolean;
}) {
  return (
    <article className="group h-full">
      <Link
        href={`/blog/${post.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_16px_48px_rgba(0,0,0,0.35)]"
      >
        {/* Featured image */}
        <div className="relative aspect-16/10 overflow-hidden bg-muted">
          {post.featured_image ? (
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover grayscale-0 md:grayscale transition-transform duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
            />
          ) : (
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-br from-white/8 via-transparent to-transparent"
            />
          )}

          {/* Image Overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-70"
          />

          {/* Category */}
          {post.category && (
            <span className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
              {post.category}
            </span>
          )}

          {featured && (
            <span className="absolute left-4 top-4 rounded-full border border-white/25 bg-white/90 px-3 py-1 text-xs font-bold text-black backdrop-blur-md">
              ویژه
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5 md:p-6">
          <div className="mb-4 flex items-center gap-3 text-xs text-muted-foreground">
            <time dateTime={post.published_at}>
              {formatDate(post.published_at)}
            </time>

            <span
              aria-hidden="true"
              className="h-1 w-1 rounded-full bg-muted-foreground/50"
            />

            <span>
              {post.view_count.toLocaleString("fa-IR")} بازدید
            </span>
          </div>

          <h2 className="mb-3 line-clamp-2 text-lg font-bold leading-[1.7] text-foreground transition-colors duration-300 group-hover:text-white md:text-xl">
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="line-clamp-3 text-sm leading-loose text-muted-foreground md:text-[15px]">
              {post.excerpt}
            </p>
          )}

          {/* Read More */}
          <div className="mt-auto pt-6">
            <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
              <span className="text-xs font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
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
        </div>
      </Link>
    </article>
  );
}
