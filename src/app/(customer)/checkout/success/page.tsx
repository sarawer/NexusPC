// src/app/(customer)/checkout/success/page.tsx
import Link from 'next/link';
import { CheckCircle, CircleAlert, Clock3 } from 'lucide-react';
import ClearPaidCart from './ClearPaidCart';

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const orderId = resolvedParams.orderId || 'NPC-UNKNOWN';
  const status = resolvedParams.status;
  const paymentFailed = status === 'failed';
  const paymentPending = status === 'pending';
  const heading = paymentFailed ? 'Payment not completed' : paymentPending ? 'Payment confirmation pending' : 'Order Confirmed!';
  const description = paymentFailed
    ? 'The bKash checkout did not complete. We have left the order pending until payment status is confirmed; check My Orders before trying again.'
    : paymentPending
      ? 'We could not confirm the payment yet. Please check My Orders before trying again to avoid a duplicate payment.'
      : 'Thank you for your purchase. We’ve received your order and are currently processing it.';
  const StatusIcon = paymentFailed ? CircleAlert : paymentPending ? Clock3 : CheckCircle;

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-200px)] py-20 flex items-center justify-center">
      <ClearPaidCart paid={status === 'success'} />
      <div className="container-site max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10 text-center flex flex-col items-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${paymentFailed ? 'bg-red-50' : paymentPending ? 'bg-amber-50' : 'bg-green-50'}`}>
            <StatusIcon size={40} className={paymentFailed ? 'text-red-500' : paymentPending ? 'text-amber-500' : 'text-green-500'} />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{heading}</h1>
          <p className="text-gray-500 mb-6">{description}</p>
          
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 w-full mb-8">
            <p className="text-sm text-gray-500 mb-1">Order Number</p>
            <p className="text-lg font-bold text-blue-700">{orderId}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Link href="/account/orders" className="btn-outline flex-1 justify-center py-3">
              View Order
            </Link>
            <Link href={paymentFailed ? '/account/orders' : '/products'} className="btn-primary flex-1 justify-center py-3 shadow-md">
              {paymentFailed ? 'Check My Orders' : 'Continue Shopping'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
