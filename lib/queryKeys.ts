export const queryKeys = {
  otp: [""],
  cart: ["cart"] as const,
  products: {
    search: (query: string) => ["products", "search", query] as const,
  },
  checkAuth:["checkAuthStatus"],
  bootstrap: ["bootstrap"] as const,
  wishlist: ["wishlist"] as const,
  addresses: ["addresses"] as const,
  provinces: ["provinces"] as const,
  cities: (provinceId: number) => ["cities", provinceId] as const,
};
