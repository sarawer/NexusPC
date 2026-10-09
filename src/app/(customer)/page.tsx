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
      <CategorySection />
      <FeaturedProducts />
      {/* Add BrandsSection, DealsSection, PCBuilderPromo later */}
    </div>
  );
}
