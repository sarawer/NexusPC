'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { productService } from '@/lib/services/productService';
import { usePCBuilderStore } from '@/store/pcBuilderStore';
import type { PCBuildSlot } from '@/types/pc-builder';
import type { Product } from '@/types/product';
import { formatPrice } from '@/lib/utils';
import { FeedbackMessage } from '@/components/ui/feedback-message';
import { notify } from '@/components/ui/toast';

export default function ChooseComponentPage() {
  const params = useParams<{ slot: string }>();
  const router = useRouter();
  const slots = usePCBuilderStore((state) => state.slots);
  const setComponent = usePCBuilderStore((state) => state.setComponent);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const slot = useMemo<PCBuildSlot | undefined>(
    () => slots.find((item) => item.key === params.slot),
    [params.slot, slots],
  );

  useEffect(() => {
    if (!slot) {
      setLoading(false);
      setError('This builder component is not available.');
      return;
    }

    let cancelled = false;
    setLoading(true);
    productService.getByCategory(slot.categorySlug)
      .then((items) => {
        if (!cancelled) setProducts(items.filter((item) => item.stockCount > 0));
      })
      .catch(() => {
        if (!cancelled) setError('Unable to load components right now.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [slot]);

  const choose = (product: Product) => {
    if (!slot) return;
    setComponent(slot.key, {
      id: product.id,
      name: product.name,
      brand: product.brand,
      image: product.images[0]?.url || '/placeholder-product.svg',
      price: product.price,
      slug: product.slug,
      specifications: product.specifications,
    });
    notify.success('Component added to your build', product.name);
    router.push('/pc-builder');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container-site max-w-6xl">
        <Link href="/pc-builder" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600">
          <ArrowLeft size={16} /> Back to PC Builder
        </Link>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Choose {slot?.label || 'Component'}</h1>
          <p className="mt-1 text-sm text-gray-500">Select an in-stock product from the database.</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center rounded-xl bg-white p-16 text-gray-500">
            <Loader2 className="mr-2 animate-spin" size={20} /> Loading components...
          </div>
        )}
        {!loading && error && <FeedbackMessage className="rounded-xl p-5">{error}</FeedbackMessage>}
        {!loading && !error && products.length === 0 && (
          <div className="rounded-xl bg-white p-16 text-center text-gray-500">No in-stock products are available for this slot.</div>
        )}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <button key={product.id} type="button" onClick={() => choose(product)} className="group rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-500 hover:shadow-md">
                <div className="relative mb-4 aspect-square rounded-lg bg-gray-50 p-3">
                  <Image src={product.images[0]?.url || '/placeholder-product.svg'} alt={product.name} fill className="object-contain mix-blend-multiply" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{product.brand}</p>
                <h2 className="mt-1 line-clamp-2 min-h-10 text-sm font-semibold text-gray-900 group-hover:text-blue-600">{product.name}</h2>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-bold text-blue-700">{formatPrice(product.price)}</span>
                  <span className="flex items-center gap-1 text-xs font-medium text-blue-600"><Check size={14} /> Select</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
