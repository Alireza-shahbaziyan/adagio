import { Post } from "@/types/posts";
import Image from "next/image";
import Link from "next/link";

export default function BlogPostCard({ post }: { post: Post }) {
  return (
    <article className="group">
      <Link
        href={`/blog/${post.slug}`}
        className="block overflow-hidden rounded-xl border border-border bg-card transition-all duration-500 hover:-translate-y-1
         hover:border-white/20"
      >
        {/* Image */}
        <div className="relative aspect-16/10 overflow-hidden bg-muted">
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover grayscale-0 md:grayscale transition-transform duration-700 ease-out group-hover:scale-105 
            group-hover:grayscale-0"
          />

          {/* Image Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-70" />

          {/* Category */}
          {post.category && (
            <span className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
              {post.category}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5 md:p-6">
          <div className="mb-4 flex items-center gap-3 text-xs text-muted-foreground">
            <time dateTime={post.published_at}>
              {post.published_at.split("T")[0]}
            </time>

            <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />

            <span>{post.view_count} بازدید</span>
          </div>

          <h2 className="mb-3 text-xl font-bold leading-[1.6] text-foreground transition-colors duration-300 group-hover:text-white md:text-2xl">
            {post.title}
          </h2>

          <p className="line-clamp-3 text-sm leading-loose text-muted-foreground md:text-[15px]">
            {post.excerpt}
          </p>

          {/* Read More */}
          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
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
      </Link>
    </article>
  );
}