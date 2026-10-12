import { Suspense } from 'react';
import HeroBanner from '@/components/home/HeroBanner';
import CategorySection from '@/components/home/CategorySection';
import FeaturedProducts from '@/components/home/FeaturedProducts';

export const metadata = {
  title: 'NexusPC | Build Your Dream Setup',
  description: 'Buy laptops, PCs, components, and tech accessories from NexusPC with EMI, COD and delivery across Bangladesh.',
};

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroBanner />
      <Suspense fallback={<HomeSectionSkeleton cards={6} />}>
        <CategorySection />
      </Suspense>
      <Suspense fallback={<HomeSectionSkeleton cards={5} featured />}>
        <FeaturedProducts />
      </Suspense>
      {/* Add BrandsSection, DealsSection, PCBuilderPromo later */}
    </div>
  );
}

function HomeSectionSkeleton({ cards, featured = false }: { cards: number; featured?: boolean }) {
  return (
    <section aria-busy="true" aria-label={featured ? 'Loading featured products' : 'Loading categories'} className={`animate-pulse ${featured ? 'border-y border-slate-100 bg-slate-50 py-12 sm:py-14 lg:py-16' : 'bg-white py-12 sm:py-14 lg:py-16'}`}>
      <div className="container-site">
        <div className="mb-8 h-7 w-52 rounded bg-slate-200" />
        <div className={`grid gap-4 ${featured ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'}`}>
          {Array.from({ length: cards }, (_, index) => <div key={index} className={`${featured ? 'aspect-[0.78]' : 'h-44'} rounded-xl border border-slate-100 bg-slate-100`} />)}
        </div>
      </div>
    </section>
  );
}
