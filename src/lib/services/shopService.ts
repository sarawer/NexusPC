import { apiFetch } from '@/lib/api';
import type { CartItem } from '@/types/cart';
import type { Order } from '@/types/order';
import type { WishlistItem } from '@/store/wishlistStore';

interface BackendCart { items: Array<Omit<CartItem, 'productId' | 'price' | 'originalPrice'> & { productId: number; price: number; originalPrice?: number }> }
interface BackendWishlist extends Omit<WishlistItem, 'productId' | 'price' | 'originalPrice' | 'addedAt' | 'stockStatus'> {
  productId: number; price: number; originalPrice?: number; stockCount: number;
}

const mapCart = (cart: BackendCart): CartItem[] => cart.items.map((item) => ({
  ...item, productId: String(item.productId), price: Number(item.price),
  originalPrice: item.originalPrice == null ? undefined : Number(item.originalPrice),
}));
const mapWishlist = (item: BackendWishlist): WishlistItem => ({
  ...item, productId: String(item.productId), price: Number(item.price),
  originalPrice: item.originalPrice == null ? undefined : Number(item.originalPrice),
  stockStatus: item.stockCount > 0 ? 'in_stock' : 'out_of_stock', addedAt: new Date().toISOString(),
});

export const cartService = {
  async get() { return mapCart(await apiFetch<BackendCart>('/cart')); },
  async add(productId: string, quantity: number) { return mapCart(await apiFetch<BackendCart>('/cart/items', { method: 'POST', body: JSON.stringify({ productId: Number(productId), quantity }) })); },
  async update(productId: string, quantity: number) { return mapCart(await apiFetch<BackendCart>(`/cart/items/${productId}`, { method: 'PUT', body: JSON.stringify({ productId: Number(productId), quantity }) })); },
  async remove(productId: string) { return mapCart(await apiFetch<BackendCart>(`/cart/items/${productId}`, { method: 'DELETE' })); },
  async clear() { return mapCart(await apiFetch<BackendCart>('/cart/clear', { method: 'DELETE' })); },
};

export const wishlistService = {
  async list() { return (await apiFetch<BackendWishlist[]>('/wishlist')).map(mapWishlist); },
  async add(productId: string) { return (await apiFetch<BackendWishlist[]>('/wishlist', { method: 'POST', body: JSON.stringify({ productId: Number(productId) }) })).map(mapWishlist); },
  async remove(productId: string) { return (await apiFetch<BackendWishlist[]>(`/wishlist/${productId}`, { method: 'DELETE' })).map(mapWishlist); },
};

export interface CreateOrderInput {
  items: { productId: string; quantity: number }[];
  shippingAddress: { name: string; email: string; phone: string; division: string; district: string; area: string; address: string };
  deliveryMethod: string; paymentMethod: string; couponCode?: string;
}
export const orderService = {
  list: () => apiFetch<Order[]>('/orders'),
  create: (input: CreateOrderInput) => apiFetch<Order>('/orders', {
    method: 'POST',
    body: JSON.stringify({ ...input, items: input.items.map((i) => ({ ...i, productId: Number(i.productId) })) }),
  }),
};
