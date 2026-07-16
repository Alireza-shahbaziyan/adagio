export interface CartItem {
  sku: string;
  quantity: number;
  product_title: string;
  size: string;
  price: number;
}

export interface Cart {
  id: number;
  token: string;
  items: CartItem[];
  total_price: number;
}
