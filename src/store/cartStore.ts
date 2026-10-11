'use client';
// src/store/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types/cart';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string;
  couponDiscount: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getTotal: (deliveryCharge: number) => number;
  getItemCount: () => number;
  replaceItems: (items: CartItem[]) => void;
}


export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: '',
      couponDiscount: 0,

      addItem: (newItem) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === newItem.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === newItem.productId
                  ? { ...i, quantity: Math.min(i.quantity + newItem.quantity, i.stockCount) }
                  : i
              ),
            };
          }
          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.min(quantity, i.stockCount) }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [], couponCode: '', couponDiscount: 0 }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      applyCoupon: (code, discount) => set({ couponCode: code.toUpperCase(), couponDiscount: discount }),

      removeCoupon: () => set({ couponCode: '', couponDiscount: 0 }),

      getSubtotal: () => {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },

      getTotal: (deliveryCharge) => {
        const subtotal = get().getSubtotal();
        const discount = get().couponDiscount;
        return subtotal - discount + deliveryCharge;
      },

      getItemCount: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },
      replaceItems: (items) => set({ items }),
    }),
    {
      name: 'nexuspc-cart',
    }
  )
);
