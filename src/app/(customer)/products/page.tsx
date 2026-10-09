import { productService } from '@/lib/services/productService';
import ProductCard from '@/components/product/ProductCard';
import FilterSidebar from './FilterSidebar';
import { SlidersHorizontal } from 'lucide-react';
import type { SortOption, StockStatus } from '@/types/product';

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

  const products = await productService.filter(filters, sort);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container-site">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters (Desktop) & Mobile trigger handled inside client component */}
          <FilterSidebar />
          
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <h1 className="text-xl font-bold text-gray-900">{filters.query ? `Search results for "${filters.query}"` : 'All Products'} <span className="text-sm font-normal text-gray-500 ml-2">({products.length} items)</span></h1>
              
              {/* Sort - Would be a client component for interaction normally, kept simple here */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-sm text-gray-500 font-medium whitespace-nowrap">Sort By:</span>
                <select 
                  className="input-base py-1.5 px-3 text-sm min-w-[150px] bg-gray-50 cursor-pointer"
                  defaultValue={sort}
                >
                  <option value="featured">Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>

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
            
            {/* Pagination (Static UI for now) */}
            {products.length > 0 && (
              <div className="mt-8 flex justify-center">
                <div className="flex gap-1">
                  <button className="w-10 h-10 rounded-md border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-50" disabled>&lt;</button>
                  <button className="w-10 h-10 rounded-md bg-blue-600 text-white font-medium flex items-center justify-center">1</button>
                  <button className="w-10 h-10 rounded-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 font-medium">2</button>
                  <button className="w-10 h-10 rounded-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 font-medium">3</button>
                  <button className="w-10 h-10 rounded-md border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">&gt;</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
