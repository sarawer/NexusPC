// src/components/home/FeaturedBuild.tsx
import { products } from '@/data/products';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { Chakra_Petch } from 'next/font/google';

const chakra = Chakra_Petch({ weight: ['400', '600', '700'], subsets: ['latin'] });

export default function FeaturedBuild() {
  const buildItems = [
    products.find(p => p.slug === 'intel-core-i9-14900k'),
    products.find(p => p.slug === 'asus-rog-strix-rtx-4090'),
    products.find(p => p.slug === 'asus-rog-maximus-z790-hero'),
    products.find(p => p.slug === 'corsair-rm1000x-1000w-gold'),
  ];

  const totalPrice = buildItems.reduce((sum, item) => sum + (item?.price || 0), 0);
  const totalOriginal = buildItems.reduce((sum, item) => sum + (item?.originalPrice || item?.price || 0), 0);
  const savings = totalOriginal - totalPrice;

  return (
    <div className={`bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl w-full max-w-[360px] mx-auto md:ml-auto ${chakra.className}`}>
      <div className="flex justify-between items-end mb-5 border-b border-slate-700 pb-3">
        <h3 className="text-white font-bold text-lg uppercase tracking-wider">Featured Build</h3>
        <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Enthusiast 4K</span>
      </div>
      
      <div className="flex flex-col gap-3 mb-6">
        {buildItems.map((item, i) => (
          item && (
            <div key={item.id} className="flex justify-between items-center text-sm border-b border-slate-700/50 pb-3 last:border-0 last:pb-0">
              <div className="flex flex-col">
                <span className="text-slate-400 text-[10px] uppercase tracking-widest mb-0.5">{item.categoryName}</span>
                <span className="text-slate-200 line-clamp-1 pr-4">{item.name}</span>
              </div>
              <span className="text-white tabular-nums font-medium">{formatPrice(item.price)}</span>
            </div>
          )
        ))}
      </div>

      <div className="bg-slate-900/60 rounded-xl p-4 mb-5 border border-slate-800">
        <div className="flex justify-between items-center mb-1">
          <span className="text-slate-400 text-sm">Total</span>
          <span className="text-slate-500 text-sm line-through decoration-red-500/50 tabular-nums">{formatPrice(totalOriginal)}</span>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-green-400 text-xs font-bold bg-green-400/10 px-2 py-1 rounded">Save {formatPrice(savings)}</span>
          <span className="text-blue-400 text-2xl font-bold tabular-nums">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      <Link href="/pc-builder" className="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-600/20 uppercase tracking-widest text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900">
        Open in PC Builder
      </Link>
    </div>
  );
}
