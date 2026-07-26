import PaginatedResponse from '@/types/response';

export interface Category {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  image: string;
  is_active: boolean;
  parent: Category | null;
}

export type CategoriesResponse = PaginatedResponse<Category>;