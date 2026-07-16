import type { User } from "@/types/auth";

export interface Bootstrap {
  user: User | null;
  cartCount: number;
  wishlistCount: number;
}
