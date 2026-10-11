'use client';
// src/app/(customer)/cart/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { useState } from 'react';
import { useEffect } from 'react';
import { cartService, couponService } from '@/lib/services/shopService';
import { notify } from '@/components/ui/toast';

export default function CartPage() {
  const { items, updateQuantity, removeItem, replaceItems, getSubtotal, applyCoupon, removeCoupon, couponCode, couponDiscount } = useCartStore();
  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  useEffect(() => {
    cartService.get().then(replaceItems).catch(() => undefined);
  }, [replaceItems]);

  const subtotal = getSubtotal();
  // Using inside dhaka delivery as default estimate
  const deliveryCharge = 80;
  const total = subtotal - couponDiscount + (items.length > 0 ? deliveryCharge : 0);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) { notify.info('Enter a coupon code first.'); return; }
    setIsApplyingCoupon(true);
    try {
      const coupon = await couponService.validate(couponInput.trim(), subtotal);
      applyCoupon(coupon.code, coupon.discount);
      setCouponInput('');
      notify.success('Coupon applied', `${coupon.code} has been applied to your cart.`);
    } catch (error) {
      notify.error(error instanceof Error ? error.message : 'Coupon code is not valid.');
    } finally { setIsApplyingCoupon(false); }
  };

  const handleQuantityChange = (productId: string, current: number, delta: number, max: number) => {
    const next = current + delta;
    if (next > 0 && next <= max) {
      updateQuantity(productId, next);
      cartService.update(productId, next).catch(() => undefined);
      notify.success('Cart quantity updated');
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-site py-20">
        <div className="max-w-md mx-auto text-center flex flex-col items-center bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag size={48} className="text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">Looks like you haven&apos;t added anything to your cart yet.</p>
          <Link href="/products" className="btn-primary py-3 px-8 text-base">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-200px)] py-10">
      <div className="container-site">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50 text-sm font-semibold text-gray-600">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right pr-4">Total</div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.productId} className="p-4 sm:grid sm:grid-cols-12 gap-4 items-center flex flex-col relative">
                    <div className="col-span-6 flex gap-4 w-full">
                      <div className="w-20 h-20 relative bg-gray-50 rounded-md border border-gray-100 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-2 mix-blend-multiply"
                        />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1 justify-center">
                        <Link 
                          href={`/products/${item.categoryName.toLowerCase()}/${item.slug}`}
                          className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors pr-6 sm:pr-0"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-gray-500 mt-1">{item.brand}</p>
                      </div>
                    </div>
                    
                    <div className="col-span-2 text-center w-full sm:w-auto mt-4 sm:mt-0 font-medium text-gray-600 hidden sm:block">
                      {formatPrice(item.price)}
                    </div>
                    
                    <div className="col-span-2 flex justify-between sm:justify-center w-full sm:w-auto mt-4 sm:mt-0">
                      <span className="sm:hidden text-sm font-medium text-gray-500">Quantity:</span>
                      <div className="flex items-center border border-gray-200 rounded-md bg-white">
                        <button 
                          onClick={() => handleQuantityChange(item.productId, item.quantity, -1, item.stockCount)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.productId, item.quantity, 1, item.stockCount)}
                          disabled={item.quantity >= item.stockCount}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-span-2 flex justify-between sm:justify-end w-full sm:w-auto mt-2 sm:mt-0">
                      <span className="sm:hidden text-sm font-medium text-gray-500">Total:</span>
                      <span className="font-bold text-blue-700 sm:pr-4">{formatPrice(item.price * item.quantity)}</span>
                    </div>

                    <button 
                      onClick={() => {
                        removeItem(item.productId);
                        cartService.remove(item.productId).catch(() => undefined);
                        notify.success('Removed from cart', item.name);
                      }}
                      className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 sm:absolute sm:right-4 text-gray-400 hover:text-red-500 transition-colors p-1 bg-white sm:bg-transparent rounded-full"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-between">
              <Link href="/products" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2">
                &larr; Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Delivery</span>
                  <span className="font-medium text-gray-900">{formatPrice(deliveryCharge)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({couponCode})</span>
                    <span className="font-medium">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                  <span className="text-gray-900 font-bold text-lg">Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-blue-700">{formatPrice(total)}</span>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-1">VAT included where applicable</p>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                {couponCode ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-green-700 font-medium text-sm">
                      <ShieldCheck size={16} />
                      Coupon Applied: {couponCode}
                    </div>
                    <button onClick={() => { removeCoupon(); notify.success('Coupon removed'); }} className="text-gray-400 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="input-base flex-1"
                    />
                    <button type="submit" disabled={isApplyingCoupon} className="btn-outline px-4 disabled:cursor-wait disabled:opacity-60">
                      {isApplyingCoupon ? 'Checking…' : 'Apply'}
                    </button>
                  </form>
                )}
              </div>

              <Link href="/checkout" className="btn-primary w-full py-3.5 justify-center text-base shadow-sm group">
                Proceed to Checkout
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
