// src/components/product/RelatedProducts.tsx
import type { Product } from '@/types/product';
import ProductCard from './ProductCard';

interface RelatedProductsProps {
  products: Product[];
  title?: string;
}

export default function RelatedProducts({ products, title = 'Related Products' }: RelatedProductsProps) {
  if (!products.length) return null;

  return (
    <section>
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
