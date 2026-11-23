import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import BlogPostCard from "@/components/blog/BlogPostCard";
import { formatDate } from "@/components/blog/formatDate";
import type { Post } from "@/types/posts";

function makePost(overrides: Partial<Post> = {}): Post {
  return {
    id: 12,
    title: "داستان یک آلبوم افسانه‌ای",
    slug: "legendary-album",
    excerpt: "خلاصه‌ای کوتاه از مقاله برای بررسی نمایش متن.",
    featured_image: "https://example.com/cover.jpg",
    category: "موسیقی",
    author: "نویسنده آداجیو",
    published_at: "2025-01-15T10:00:00Z",
    view_count: 1234,
    ...overrides,
  };
}

describe("BlogPostCard", () => {
  it("links to the article and shows title, category and excerpt", () => {
    const post = makePost();
    render(<BlogPostCard post={post} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/blog/legendary-album");
    expect(
      screen.getByRole("heading", { name: post.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(post.category)).toBeInTheDocument();
    expect(screen.getByText(post.excerpt)).toBeInTheDocument();
  });

  it("formats the date and view count like the article page", () => {
    const post = makePost();
    render(<BlogPostCard post={post} />);

    expect(
      screen.getByText(formatDate(post.published_at)),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `${post.view_count.toLocaleString("fa-IR")} بازدید`,
      ),
    ).toBeInTheDocument();

    // The raw ISO date no longer leaks into the visible metadata.
    expect(screen.queryByText("2025-01-15")).not.toBeInTheDocument();
  });

  it("marks featured posts only when the featured flag is set", () => {
    const post = makePost();
    const { rerender } = render(<BlogPostCard post={post} featured />);

    expect(screen.getByText("ویژه")).toBeInTheDocument();

    rerender(<BlogPostCard post={post} />);
    expect(screen.queryByText("ویژه")).not.toBeInTheDocument();
  });

  it("handles a missing featured image gracefully", () => {
    const post = makePost({ featured_image: "" });
    render(<BlogPostCard post={post} />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText(post.title)).toBeInTheDocument();
  });
});
