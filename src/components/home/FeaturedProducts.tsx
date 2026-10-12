// src/components/home/FeaturedProducts.tsx
import { productService } from '@/lib/services/productService';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';

export default async function FeaturedProducts() {
  const products = await productService.getFeatured(10); // Fetch top 10

  return (
    <section className="border-y border-slate-100 bg-slate-50 py-12 sm:py-14 lg:py-16">
      <div className="container-site">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:mb-8 sm:flex-row sm:items-end">
          <div>
            <h2 className="section-title">Featured Products</h2>
            <p className="mt-2 pl-3 text-sm text-slate-500">A few popular picks to get your build started.</p>
          </div>
          <Link href="/products" className="ml-3 inline-flex w-fit items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700">Browse all products <span aria-hidden="true">→</span></Link>
        </div>
        
        {/* Simple responsive grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
