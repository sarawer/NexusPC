'use client';
// src/store/wishlistStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  originalPrice?: number;
  categoryName: string;
  stockStatus: string;
  addedAt: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  toggleItem: (item: WishlistItem) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  replaceItems: (items: WishlistItem[]) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => ({
          items: state.items.some((i) => i.productId === newItem.productId)
            ? state.items
            : [...state.items, { ...newItem, addedAt: new Date().toISOString() }],
        }));
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      toggleItem: (item) => {
        const { isInWishlist, addItem, removeItem } = get();
        if (isInWishlist(item.productId)) {
          removeItem(item.productId);
        } else {
          addItem(item);
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((i) => i.productId === productId);
      },

      clearWishlist: () => set({ items: [] }),
      replaceItems: (items) => set({ items }),
    }),
    {
      name: 'nexuspc-wishlist',
    }
  )
);
