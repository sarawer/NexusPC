'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';

export default function ClearPaidCart({ paid }: { paid: boolean }) {
  const clearCart = useCartStore((state) => state.clearCart);
  useEffect(() => {
    if (paid) clearCart();
  }, [clearCart, paid]);
  return null;
}
