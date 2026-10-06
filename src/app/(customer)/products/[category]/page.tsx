import { productService } from '@/lib/services/productService';
import ProductCard from '@/components/product/ProductCard';
import FilterSidebar from '../FilterSidebar';
import { SlidersHorizontal } from 'lucide-react';
import type { SortOption, StockStatus } from '@/types/product';
import { categories } from '@/data/categories';

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const categorySlug = resolvedParams.category;
  const category = categories.find(c => c.slug === categorySlug);
  
  // Parse filters
  const filters = {
    categorySlug,
    brands: resolvedSearchParams.brands ? (resolvedSearchParams.brands as string).split(',') : undefined,
    minPrice: resolvedSearchParams.minPrice ? parseInt(resolvedSearchParams.minPrice as string) : undefined,
    maxPrice: resolvedSearchParams.maxPrice ? parseInt(resolvedSearchParams.maxPrice as string) : undefined,
    stockStatus: resolvedSearchParams.stockStatus ? (resolvedSearchParams.stockStatus as string).split(',') as StockStatus[] : undefined,
  };
  
  const sort = (resolvedSearchParams.sort as SortOption) || 'featured';

  const products = await productService.filter(filters, sort);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      {/* Simple Banner for Category */}
      {category && (
        <div className="container-site mb-8">
          <div className="bg-blue-900 rounded-xl overflow-hidden relative p-8 md:p-12 text-white">
             {/* Decorative element */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/30 blur-[80px] rounded-full" />
             <div className="relative z-10">
               <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{category.name}</h1>
               <p className="text-blue-200 max-w-2xl">{category.description}</p>
             </div>
          </div>
        </div>
      )}

      <div className="container-site">
        <div className="flex flex-col md:flex-row gap-8">
          <FilterSidebar />
          
          <div className="flex-1">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {category?.name || 'Products'} <span className="text-sm font-normal text-gray-500 ml-2">({products.length} items)</span>
              </h2>
              
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
          </div>
        </div>
      </div>
    </div>
  );
}
