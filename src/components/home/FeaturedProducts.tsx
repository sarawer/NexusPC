// src/components/home/FeaturedProducts.tsx
import { productService } from '@/lib/services/productService';
import ProductCard from '@/components/product/ProductCard';

export default async function FeaturedProducts() {
  const products = await productService.getFeatured(10); // Fetch top 10

  return (
    <section className="py-16 bg-slate-50 border-y border-slate-100">
      <div className="container-site">
        <div className="section-header">
          <h2 className="section-title">Featured Products</h2>
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
