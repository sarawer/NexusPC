'use client';
// src/components/cart/CartDrawer.tsx
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { notify } from '@/components/ui/toast';

export default function CartDrawer() {
  const { 
    items, 
    isOpen, 
    closeCart, 
    updateQuantity, 
    removeItem, 
    getSubtotal,
    getItemCount
  } = useCartStore();

  const handleQuantityChange = (productId: string, current: number, delta: number, max: number) => {
    const next = current + delta;
    if (next > 0 && next <= max) {
      updateQuantity(productId, next);
      notify.success('Cart quantity updated');
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l border-gray-200">
        <SheetHeader className="p-4 border-b border-gray-100 flex flex-row items-center justify-between">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag size={20} />
            Your Cart ({getItemCount()})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-500">
              <ShoppingBag size={48} className="text-gray-300 mb-4" />
              <p className="font-medium text-gray-900 mb-1">Your cart is empty</p>
              <p className="text-sm mb-6">Looks like you haven&apos;t added anything yet.</p>
              <SheetClose nativeButton={false} render={<Link href="/products" className="btn-primary" />}>
                  Start Shopping
              </SheetClose>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.productId} className="flex gap-4 border border-gray-100 rounded-lg p-3 bg-white relative">
                <div className="w-20 h-20 relative bg-gray-50 rounded-md flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-1 mix-blend-multiply"
                  />
                </div>
                
                <div className="flex-1 flex flex-col min-w-0">
                  <Link 
                    href={`/products/${item.categoryName.toLowerCase()}/${item.slug}`}
                    onClick={closeCart}
                    className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors pr-6"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-gray-500 mt-1">{item.brand}</p>
                  
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <span className="font-bold text-blue-600">{formatPrice(item.price)}</span>
                    
                    <div className="flex items-center border border-gray-200 rounded-md bg-white">
                      <button 
                        onClick={() => handleQuantityChange(item.productId, item.quantity, -1, item.stockCount)}
                        className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.productId, item.quantity, 1, item.stockCount)}
                        disabled={item.quantity >= item.stockCount}
                        className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => { removeItem(item.productId); notify.success('Removed from cart', item.name); }}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors p-1"
                  aria-label="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-bold text-gray-900">{formatPrice(getSubtotal())}</span>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Delivery charges and taxes calculated at checkout.
            </p>
            <SheetClose nativeButton={false} render={<Link href="/checkout" className="w-full btn-primary py-3 justify-center text-base shadow-sm" />}>
                Proceed to Checkout
            </SheetClose>
            <SheetClose nativeButton={false} render={<Link href="/cart" className="w-full btn-outline py-2.5 justify-center mt-2" />}>
                View Full Cart
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
