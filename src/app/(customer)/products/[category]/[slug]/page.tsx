import { productService } from '@/lib/services/productService';
import Image from 'next/image';
import { ShieldCheck, Truck, RefreshCw, Star } from 'lucide-react';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import AddToCartAction from './AddToCartAction';
import { notFound } from 'next/navigation';
import RelatedProducts from '@/components/product/RelatedProducts';
import ProductDetailsTabs from './ProductDetailsTabs';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const product = await productService.getBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const isOutOfStock = product.stockStatus === 'out_of_stock' || product.stockCount === 0;
  const relatedProducts = await productService.getRelated(product, 4);

  return (
    <div className="bg-white pb-20">
      {/* Breadcrumbs */}
      <div className="bg-slate-50 border-b border-gray-100 py-3 text-sm text-gray-500">
        <div className="container-site flex items-center gap-2">
          <span>Home</span>
          <span>/</span>
          <span className="capitalize">{product.categorySlug}</span>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </div>
      </div>

      <div className="container-site pt-8 md:pt-12">
        <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">
          
          {/* Left: Images */}
          <div className="w-full lg:w-5/12 xl:w-1/2 flex flex-col gap-4">
            <div className="relative aspect-square rounded-xl border border-gray-100 bg-white p-8 flex items-center justify-center overflow-hidden">
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {product.discountPercent && product.discountPercent > 0 ? (
                  <span className="bg-red-100 text-red-700 text-sm font-bold px-3 py-1 rounded-md">
                    -{product.discountPercent}% OFF
                  </span>
                ) : product.originalPrice ? (
                  <span className="bg-red-100 text-red-700 text-sm font-bold px-3 py-1 rounded-md">
                    -{calculateDiscount(product.originalPrice, product.price)}% OFF
                  </span>
                ) : null}
              </div>

              <Image
                src={product.images[0]?.url || `https://placehold.co/800x800/1E3A8A/FFFFFF?text=${encodeURIComponent(product.name)}`}
                alt={product.images[0]?.alt || product.name}
                fill
                priority
                className="object-contain p-4 mix-blend-multiply"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img, idx) => (
                  <button key={img.id} className={`relative w-24 h-24 rounded-lg border-2 flex-shrink-0 bg-white ${idx === 0 ? 'border-blue-600' : 'border-gray-100 hover:border-gray-300'}`}>
                    <Image src={img.url} alt={img.alt} fill className="object-contain p-2 mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="w-full lg:w-7/12 xl:w-1/2 flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">
              {product.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                {product.brand}
              </span>
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={16} fill="currentColor" />
                <span className="font-semibold text-gray-900">{product.rating}</span>
                <span className="text-gray-500">({product.reviewCount} Reviews)</span>
              </div>
              <div className="text-gray-500">SKU: <span className="text-gray-900">{product.sku}</span></div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 mb-8">
              <div className="mb-2 flex flex-wrap items-end gap-x-3 gap-y-1">
                <span className="text-3xl font-extrabold text-blue-700">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through mb-1 font-medium">{formatPrice(product.originalPrice)}</span>
                )}
              </div>
              
              <div className="flex items-center gap-2 mt-4">
                <div className={`w-3 h-3 rounded-full ${isOutOfStock ? 'bg-red-500' : product.stockStatus === 'low_stock' ? 'bg-amber-500' : 'bg-green-500'}`} />
                <span className={`font-semibold ${isOutOfStock ? 'text-red-600' : product.stockStatus === 'low_stock' ? 'text-amber-600' : 'text-green-600'}`}>
                  {isOutOfStock ? 'Out of Stock' : product.stockStatus === 'low_stock' ? `Low Stock (Only ${product.stockCount} left)` : 'In Stock'}
                </span>
              </div>
            </div>

            {/* Quick Specs */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Key Features</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                {product.specifications.slice(0, 6).map((spec, idx) => (
                  <li key={idx} className="flex flex-col">
                    <span className="text-gray-500">{spec.label}</span>
                    <span className="font-medium text-gray-900">{spec.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Add to Cart Actions */}
            <AddToCartAction product={product} />

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-100">
              <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Warranty</div>
                  <div className="text-xs text-gray-500">{product.warranty}</div>
                </div>
              </div>
              <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                  <Truck size={20} />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Home Delivery</div>
                  <div className="text-xs text-gray-500">1-3 Days inside Dhaka</div>
                </div>
              </div>
              <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                  <RefreshCw size={20} />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">3 Days Return</div>
                  <div className="text-xs text-gray-500">If product is defective</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <ProductDetailsTabs slug={product.slug} productName={product.name} specifications={product.specifications} description={product.description} reviewCount={product.reviewCount} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="container-site mt-20">
          <RelatedProducts products={relatedProducts} title="You May Also Like" />
        </div>
      )}
    </div>
  );
}
