'use client';
import { useCallback, useEffect, useState } from 'react';
import type { Order } from '@/types/order';
import { orderService } from '@/lib/services/shopService';
import { formatPrice, formatDate } from '@/lib/utils';
import { Package, ChevronRight, CheckCircle2, Clock, Truck, CircleX, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const loadOrders = useCallback(async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    try { setOrders(await orderService.list()); setLoadError(''); }
    catch { setLoadError('Could not load your orders. Please try again.'); }
    finally { setIsLoading(false); }
  }, []);
  useEffect(() => {
    const handleFocus = () => { void loadOrders(true); };
    const initialLoad = window.setTimeout(() => { void loadOrders(); }, 0);
    window.addEventListener('focus', handleFocus);
    return () => {
      window.clearTimeout(initialLoad);
      window.removeEventListener('focus', handleFocus);
    };
  }, [loadOrders]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle2 size={16} className="text-green-500" />;
      case 'confirmed': return <CheckCircle2 size={16} className="text-blue-500" />;
      case 'shipped': return <Truck size={16} className="text-blue-500" />;
      case 'cancelled': return <CircleX size={16} className="text-red-500" />;
      default: return <Clock size={16} className="text-amber-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'confirmed': case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'processing': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-900">My Orders</h2>
        <button type="button" onClick={() => void loadOrders(true)} disabled={isLoading} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-blue-300 hover:text-blue-700 disabled:opacity-60">
          <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {loadError ? <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{loadError}</div> : isLoading && orders.length === 0 ? <p className="py-12 text-center text-sm text-gray-500">Loading your orders…</p> : orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500 mb-4">You haven&apos;t placed any orders yet.</p>
          <Link href="/products" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-bold text-gray-900">{order.orderNumber}</p>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                  <p className="font-bold text-blue-600">{formatPrice(order.total)}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="w-10 h-10 rounded-full border-2 border-white bg-gray-50 overflow-hidden relative">
                      <Image src={item.image} alt={item.name} fill className="object-cover p-1" />
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 relative z-10">
                      +{order.items.length - 3}
                    </div>
                  )}
                  <span className="ml-4 text-sm text-gray-600 hidden sm:inline-block pl-2">
                    {order.items.length} item{order.items.length > 1 ? 's' : ''}
                  </span>
                </div>
                
                <Link href={`/account/orders/${order.id}`} className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800">
                  View Details <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
