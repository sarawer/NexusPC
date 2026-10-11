import { productService } from '@/lib/services/productService';
import ProductCard from '@/components/product/ProductCard';
import FilterSidebar from '../FilterSidebar';
import { SlidersHorizontal } from 'lucide-react';
import type { SortOption, StockStatus } from '@/types/product';
import { categories } from '@/data/categories';
import ProductResultsToolbar from '../ProductResultsToolbar';

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

  const allProducts = await productService.filter(filters, sort);
  const pageSize = 12;
  const pageCount = Math.max(1, Math.ceil(allProducts.length / pageSize));
  const page = Math.min(pageCount - 1, Math.max(0, Number(resolvedSearchParams.page) || 0));
  const products = allProducts.slice(page * pageSize, (page + 1) * pageSize);

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
            <ProductResultsToolbar title={category?.name || 'Products'} count={allProducts.length} sort={sort} page={page} pageSize={pageSize} />

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
