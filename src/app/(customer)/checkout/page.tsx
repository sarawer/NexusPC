'use client';
// src/app/(customer)/checkout/page.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShieldCheck, Truck, CreditCard, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { orderService } from '@/lib/services/shopService';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, couponDiscount, clearCart } = useCartStore();
  const [deliveryMethod, setDeliveryMethod] = useState('inside_dhaka');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const subtotal = getSubtotal();
  const deliveryCharge = deliveryMethod === 'inside_dhaka' ? 80 : 150;
  const total = subtotal - couponDiscount + (items.length > 0 ? deliveryCharge : 0);

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
    setSubmitError('');
    const form = new FormData(e.currentTarget);
    try {
      const order = await orderService.create({
        items: items.map(({ productId, quantity }) => ({ productId, quantity })),
        shippingAddress: {
          name: `${form.get('firstName') || ''} ${form.get('lastName') || ''}`.trim(),
          email: String(form.get('email') || ''),
          phone: String(form.get('phone') || ''),
          division: 'Dhaka',
          district: String(form.get('district') || ''),
          area: String(form.get('area') || form.get('district') || ''),
          address: String(form.get('address') || ''),
        },
        deliveryMethod,
        paymentMethod,
        couponCode: couponDiscount > 0 ? useCartStore.getState().couponCode : undefined,
      });
      clearCart();
      router.push(`/checkout/success?orderId=${order.id}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to place order. Please try again.');
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
                    <Select defaultValue="dhaka" required>
                      <SelectTrigger id="division">
                        <SelectValue placeholder="Select Division" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dhaka">Dhaka</SelectItem>
                        <SelectItem value="chattogram">Chattogram</SelectItem>
                        <SelectItem value="sylhet">Sylhet</SelectItem>
                        <SelectItem value="rajshahi">Rajshahi</SelectItem>
                        <SelectItem value="khulna">Khulna</SelectItem>
                      </SelectContent>
                    </Select>
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
                <div className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-colors cursor-pointer ${deliveryMethod === 'inside_dhaka' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200'}`}>
                  <RadioGroupItem value="inside_dhaka" id="delivery_inside" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="delivery_inside" className="text-base font-semibold cursor-pointer block mb-1">Inside Dhaka</Label>
                    <p className="text-sm text-gray-500">Delivery in 1-2 days</p>
                  </div>
                  <span className="font-bold text-gray-900">৳80</span>
                </div>
                
                <div className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-colors cursor-pointer ${deliveryMethod === 'outside_dhaka' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200'}`}>
                  <RadioGroupItem value="outside_dhaka" id="delivery_outside" className="mt-1" />
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
              
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`flex flex-col items-center gap-3 p-4 rounded-lg border-2 text-center transition-colors cursor-pointer ${paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200 hover:border-blue-200'}`}>
                  <RadioGroupItem value="cod" id="pay_cod" className="sr-only" />
                  <Label htmlFor="pay_cod" className="cursor-pointer flex flex-col items-center w-full h-full">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-3">
                      <Truck size={24} />
                    </div>
                    <span className="font-bold text-gray-900">Cash on Delivery</span>
                    <span className="text-xs text-gray-500 mt-1">Pay when you receive</span>
                  </Label>
                </div>

                <div className={`flex flex-col items-center gap-3 p-4 rounded-lg border-2 text-center transition-colors cursor-pointer ${paymentMethod === 'bkash' ? 'border-pink-600 bg-pink-50/50' : 'border-gray-200 hover:border-pink-200'}`}>
                  <RadioGroupItem value="bkash" id="pay_bkash" className="sr-only" />
                  <Label htmlFor="pay_bkash" className="cursor-pointer flex flex-col items-center w-full h-full">
                    <div className="w-12 h-12 bg-pink-600 text-white font-bold rounded-full flex items-center justify-center mb-3 text-sm">
                      bKash
                    </div>
                    <span className="font-bold text-gray-900">bKash Payment</span>
                    <span className="text-xs text-gray-500 mt-1">Instant mobile payment</span>
                  </Label>
                </div>

                <div className={`flex flex-col items-center gap-3 p-4 rounded-lg border-2 text-center transition-colors cursor-pointer ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200 hover:border-blue-200'}`}>
                  <RadioGroupItem value="card" id="pay_card" className="sr-only" />
                  <Label htmlFor="pay_card" className="cursor-pointer flex flex-col items-center w-full h-full">
                    <div className="w-12 h-12 bg-slate-800 text-white rounded-full flex items-center justify-center mb-3">
                      <CreditCard size={24} />
                    </div>
                    <span className="font-bold text-gray-900">Card Payment</span>
                    <span className="text-xs text-gray-500 mt-1">Visa, Master, Amex</span>
                  </Label>
                </div>
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
                    <span>Discount</span>
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
              {submitError && <p className="mt-3 text-sm text-red-600">{submitError}</p>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
