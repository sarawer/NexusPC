import { productService } from '@/lib/services/productService';
import ProductCard from '@/components/product/ProductCard';
import FilterSidebar from './FilterSidebar';
import { SlidersHorizontal } from 'lucide-react';
import type { SortOption, StockStatus } from '@/types/product';
import ProductResultsToolbar from './ProductResultsToolbar';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  
  // Parse filters from URL
  const filters = {
    query: resolvedParams.q ? String(resolvedParams.q) : undefined,
    brands: resolvedParams.brands ? (resolvedParams.brands as string).split(',') : undefined,
    minPrice: resolvedParams.minPrice ? parseInt(resolvedParams.minPrice as string) : undefined,
    maxPrice: resolvedParams.maxPrice ? parseInt(resolvedParams.maxPrice as string) : undefined,
    stockStatus: resolvedParams.stockStatus ? (resolvedParams.stockStatus as string).split(',') as StockStatus[] : undefined,
  };
  
  const sort = (resolvedParams.sort as SortOption) || 'featured';

  const allProducts = await productService.filter(filters, sort);
  const pageSize = 12;
  const pageCount = Math.max(1, Math.ceil(allProducts.length / pageSize));
  const page = Math.min(pageCount - 1, Math.max(0, Number(resolvedParams.page) || 0));
  const products = allProducts.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container-site">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters (Desktop) & Mobile trigger handled inside client component */}
          <FilterSidebar />
          
          {/* Main Content */}
          <div className="flex-1">
            <ProductResultsToolbar title={filters.query ? `Search results for "${filters.query}"` : 'All Products'} count={allProducts.length} sort={sort} page={page} pageSize={pageSize} />

            {products.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <SlidersHorizontal size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters to find what you&apos;re looking for.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
