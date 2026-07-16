export interface CustomerGalleryItem {
  id: number;
  image: string;
  customer_name: string;
  caption: string;
  created_at: string;
}

  export type GalleryResponse = PaginatedResponse<CustomerGalleryItem>;