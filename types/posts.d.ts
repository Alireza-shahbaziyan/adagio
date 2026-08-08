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

