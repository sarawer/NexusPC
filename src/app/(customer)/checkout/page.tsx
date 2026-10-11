'use client';
// src/app/(customer)/checkout/page.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShieldCheck, Truck, ChevronRight, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { couponService, orderService } from '@/lib/services/shopService';
import { notify } from '@/components/ui/toast';
import { useIsAuthenticated, useIsClient } from '@/lib/authState';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, couponDiscount, couponCode, applyCoupon, removeCoupon, clearCart, hasHydrated } = useCartStore();
  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('inside_dhaka');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [division, setDivision] = useState('dhaka');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSignedIn = useIsAuthenticated();
  const isClient = useIsClient();

  const subtotal = getSubtotal();
  const deliveryCharge = deliveryMethod === 'inside_dhaka' ? 80 : 150;
  const total = Math.max(0, subtotal - couponDiscount) + (items.length > 0 ? deliveryCharge : 0);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) { notify.info('Enter a coupon code first.'); return; }
    setIsApplyingCoupon(true);
    try {
      const coupon = await couponService.validate(couponInput.trim(), subtotal);
      applyCoupon(coupon.code, coupon.discount);
      setCouponInput('');
      notify.success('Coupon applied', `${coupon.code} has been applied to your order.`);
    } catch (error) {
      notify.error(error instanceof Error ? error.message : 'Coupon code is not valid.');
    } finally { setIsApplyingCoupon(false); }
  };

  if (!hasHydrated || !isClient) {
    return <div className="container-site min-h-96 py-20 text-center text-gray-500" aria-live="polite">Loading checkout…</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="container-site py-20 text-center">
        <h1 className="mb-3 text-2xl font-bold">Sign in to continue to checkout</h1>
        <p className="mb-6 text-gray-600">Your cart will be here after you sign in or create an account.</p>
        <div className="flex justify-center gap-3">
          <Link href="/login?redirect=%2Fcheckout" className="btn-primary">Login</Link>
          <Link href="/register" className="btn-outline">Create account</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-site py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link href="/products" className="btn-primary">Return to Shop</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = new FormData(e.currentTarget);
    try {
      const order = await orderService.create({
        items: items.map(({ productId, quantity }) => ({ productId, quantity })),
        shippingAddress: {
          name: `${form.get('firstName') || ''} ${form.get('lastName') || ''}`.trim(),
          email: String(form.get('email') || ''),
          phone: String(form.get('phone') || ''),
          division: division.charAt(0).toUpperCase() + division.slice(1),
          district: String(form.get('district') || ''),
          area: String(form.get('area') || form.get('district') || ''),
          address: String(form.get('address') || ''),
        },
        deliveryMethod,
        paymentMethod,
        couponCode: couponCode || undefined,
      });
      if (order.paymentMethod === 'bkash') {
        if (!order.paymentUrl) throw new Error('Could not start bKash payment. Please try again.');
        window.location.assign(order.paymentUrl);
        return;
      }
      clearCart();
      notify.success('Order placed successfully', `Order #${order.id} is confirmed.`);
      router.push(`/checkout/success?orderId=${order.id}`);
    } catch (error) {
      notify.error(error instanceof Error ? error.message : 'Unable to place order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container-site max-w-6xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 font-medium">
          <Link href="/cart" className="hover:text-blue-600 transition-colors">Cart</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900">Checkout</span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
          {/* Left: Forms */}
          <div className="w-full lg:w-2/3 space-y-6">
            
            {/* Shipping Details */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                Shipping Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" name="firstName" required placeholder="Enter first name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" name="lastName" required placeholder="Enter last name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" name="phone" type="tel" required placeholder="017XX-XXXXXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" name="email" type="email" required placeholder="you@example.com" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="division">Division *</Label>
                    <Select value={division} onValueChange={(value) => setDivision(value ?? 'dhaka')} required>
                      <SelectTrigger id="division" className="h-11 w-full min-w-0 bg-white px-3 text-gray-900">
                        <SelectValue placeholder="Select Division" />
                      </SelectTrigger>
                      <SelectContent align="start" sideOffset={6} className="w-(--anchor-width) border border-gray-200 bg-white p-1 shadow-lg">
                        <SelectItem value="dhaka">Dhaka</SelectItem>
                        <SelectItem value="khulna">Khulna</SelectItem>
                        <SelectItem value="mymensingh">Mymensingh</SelectItem>
                        <SelectItem value="rajshahi">Rajshahi</SelectItem>
                        <SelectItem value="rangpur">Rangpur</SelectItem>
                        <SelectItem value="sylhet">Sylhet</SelectItem>
                        <SelectItem value="barishal">Barishal</SelectItem>
                        <SelectItem value="chattagram">Chattagram</SelectItem>
                      </SelectContent>
                    </Select>
                    <input type="hidden" name="division" value={division} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">District / City *</Label>
                    <Input id="district" name="district" required placeholder="E.g. Dhaka" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Detailed Address *</Label>
                  <Input id="address" name="address" required placeholder="House No, Road No, Area" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Area *</Label>
                  <Input id="area" name="area" required placeholder="E.g. Mirpur" />
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                Delivery Method
              </h2>
              
              <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod} className="gap-4">
                <div onClick={() => setDeliveryMethod('inside_dhaka')} className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-colors cursor-pointer ${deliveryMethod === 'inside_dhaka' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200'}`}>
                  <RadioGroupItem checked={deliveryMethod === 'inside_dhaka'} onChange={() => setDeliveryMethod('inside_dhaka')} value="inside_dhaka" id="delivery_inside" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="delivery_inside" className="text-base font-semibold cursor-pointer block mb-1">Inside Dhaka</Label>
                    <p className="text-sm text-gray-500">Delivery in 1-2 days</p>
                  </div>
                  <span className="font-bold text-gray-900">৳80</span>
                </div>
                
                <div onClick={() => setDeliveryMethod('outside_dhaka')} className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-colors cursor-pointer ${deliveryMethod === 'outside_dhaka' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200'}`}>
                  <RadioGroupItem checked={deliveryMethod === 'outside_dhaka'} onChange={() => setDeliveryMethod('outside_dhaka')} value="outside_dhaka" id="delivery_outside" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="delivery_outside" className="text-base font-semibold cursor-pointer block mb-1">Outside Dhaka</Label>
                    <p className="text-sm text-gray-500">Delivery in 3-5 days via Sundarban/SA Paribahan</p>
                  </div>
                  <span className="font-bold text-gray-900">৳150</span>
                </div>
              </RadioGroup>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                Payment Method
              </h2>
              
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div onClick={() => setPaymentMethod('cod')} className={`flex flex-col items-center gap-3 p-4 rounded-lg border-2 text-center transition-colors cursor-pointer ${paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200 hover:border-blue-200'}`}>
                  <RadioGroupItem checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} value="cod" id="pay_cod" className="sr-only" />
                  <Label htmlFor="pay_cod" className="cursor-pointer flex flex-col items-center w-full h-full">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-3">
                      <Truck size={24} />
                    </div>
                    <span className="font-bold text-gray-900">Cash on Delivery</span>
                    <span className="text-xs text-gray-500 mt-1">Pay when you receive</span>
                  </Label>
                </div>

                <button type="button" onClick={() => notify.info('Coming soon', 'bKash payment will be available soon.')} className="flex min-h-36 flex-col items-center justify-center gap-3 rounded-lg border-2 border-gray-200 p-4 text-center transition-colors hover:border-pink-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500">
                      <div className="w-16 h-12 bg-white rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                        <Image src="/bkash-logo.png" alt="bKash" width={64} height={48} className="h-full w-full object-contain" />
                      </div>
                      <span className="font-bold text-gray-900">bKash Payment</span>
                      <span className="text-xs font-medium text-gray-500">Coming soon</span>
                </button>
                <button type="button" onClick={() => notify.info('Coming soon', 'Nagad payment will be available soon.')} className="flex min-h-36 flex-col items-center justify-center gap-3 rounded-lg border-2 border-gray-200 p-4 text-center transition-colors hover:border-orange-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                  <div className="mb-3 flex h-12 w-16 items-center justify-center rounded-lg bg-orange-50 text-lg font-extrabold text-orange-600">Nagad</div>
                  <span className="font-bold text-gray-900">Nagad Payment</span>
                  <span className="text-xs font-medium text-gray-500">Coming soon</span>
                </button>
              </RadioGroup>
            </div>

          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Your Order</h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.productId} className="flex gap-3 text-sm">
                    <div className="relative w-12 h-12 bg-gray-50 border border-gray-100 rounded flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <p className="text-gray-900 font-medium truncate">{item.name}</p>
                      <p className="text-gray-500">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                {couponCode ? (
                  <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                    <span className="font-medium">Coupon applied: {couponCode}</span>
                    <button type="button" onClick={() => { removeCoupon(); notify.success('Coupon removed'); }} className="text-gray-400 transition-colors hover:text-red-500" aria-label="Remove coupon"><Trash2 size={15} /></button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      aria-label="Promo code"
                      type="text"
                      placeholder="Promo Code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void handleApplyCoupon(); } }}
                      className="input-base min-w-0 flex-1"
                    />
                    <button type="button" onClick={() => void handleApplyCoupon()} disabled={isApplyingCoupon} className="btn-outline px-4 disabled:cursor-wait disabled:opacity-60">{isApplyingCoupon ? 'Checking…' : 'Apply'}</button>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge</span>
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
                  <span className="text-2xl font-extrabold text-blue-700">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-6 flex items-start gap-2 bg-blue-50 p-3 rounded-lg text-xs text-blue-800">
                <ShieldCheck size={16} className="flex-shrink-0 mt-0.5" />
                <p>Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.</p>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn-primary w-full py-4 justify-center text-base shadow-sm mt-6 group disabled:opacity-70 disabled:cursor-wait"
              >
                {isSubmitting ? 'Processing Order...' : 'Confirm Order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
