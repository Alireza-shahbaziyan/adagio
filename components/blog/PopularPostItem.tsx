import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/types/posts";
import { formatDate } from "./formatDate";

/**
 * Compact ranked row used by the "most read" section so visitors can scan
 * popular articles faster than with full-size cards.
 */
export default function PopularPostItem({
  post,
  rank,
}: {
  post: Post;
  rank: number;
}) {
  return (
    <li className="group h-full">
      <Link
        href={`/blog/${post.slug}`}
        className="flex h-full items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.03]"
      >
        <span
          aria-hidden="true"
          className="w-8 shrink-0 text-center text-2xl font-black tabular-nums text-muted-foreground/50 transition-colors duration-300 group-hover:text-foreground md:text-3xl"
        >
          {rank.toLocaleString("fa-IR")}
        </span>

        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted md:h-20 md:w-20">
          {post.featured_image ? (
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              sizes="80px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-br from-white/8 via-transparent to-transparent"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm font-bold leading-[1.8] text-foreground md:text-base">
            {post.title}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
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
        </div>
      </Link>
    </li>
  );
}
