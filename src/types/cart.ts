// src/types/cart.ts
export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  stockCount: number;
  categoryName: string;
}

export interface Cart {
  items: CartItem[];
  couponCode?: string;
  couponDiscount?: number;
}
