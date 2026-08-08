// @/types/posts.d.ts
import PaginatedResponse from "@/types/response";
export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  category: string;
  author: string;
  published_at: string;
  view_count: number;
}

export type PostsResponse = PaginatedResponse<Post>;

export interface PostMedia {
  id: number;
  file: string;
  alt_text: string;
  is_video: boolean | string;
}

export interface PostMetaTag {
  title: string;
  description: string;
  canonical_url: string;
  is_indexable: boolean;
  og_title: string;
  og_description: string;
  og_image: string;
  twitter_card: string;
}

export interface PostDetail {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content_html: string;
  featured_image: string;
  category: string;
  author: string;
  view_count: number;
  allow_comments: boolean;
  media: PostMedia[];
  meta_tag: PostMetaTag;
  json_ld: Record<string, unknown>;
  breadcrumb_ld: Record<string, unknown>;
  published_at: string;
  updated_at: string;
}