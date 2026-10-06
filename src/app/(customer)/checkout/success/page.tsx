// src/app/(customer)/checkout/success/page.tsx
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const orderId = resolvedParams.orderId || 'NPC-UNKNOWN';

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-200px)] py-20 flex items-center justify-center">
      <div className="container-site max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-500 mb-6">Thank you for your purchase. We&apos;ve received your order and are currently processing it.</p>
          
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 w-full mb-8">
            <p className="text-sm text-gray-500 mb-1">Order Number</p>
            <p className="text-lg font-bold text-blue-700">{orderId}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Link href="/account/orders" className="btn-outline flex-1 justify-center py-3">
              View Order
            </Link>
            <Link href="/products" className="btn-primary flex-1 justify-center py-3 shadow-md">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
