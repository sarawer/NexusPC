'use client';
// src/components/product/ProductCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart, Eye, ArrowRightLeft } from 'lucide-react';
import type { Product } from '@/types/product';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItemToCart = useCartStore((state) => state.addItem);
  const { items: wishlistItems, toggleItem: toggleWishlist } = useWishlistStore();
  
  const isWishlisted = wishlistItems.some((item) => item.productId === product.id);
  const isOutOfStock = product.stockStatus === 'out_of_stock' || product.stockCount === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    
    addItemToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      image: product.images[0]?.url || '',
      price: product.price,
      originalPrice: product.originalPrice,
      quantity: 1,
      stockCount: product.stockCount,
      categoryName: product.categoryName,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      image: product.images[0]?.url || '',
      price: product.price,
      originalPrice: product.originalPrice,
      categoryName: product.categoryName,
      stockStatus: product.stockStatus,
      addedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="product-card group flex flex-col h-full bg-white relative">
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5">
        {product.discountPercent && product.discountPercent > 0 ? (
          <span className="badge-sale">-{product.discountPercent}%</span>
        ) : product.originalPrice ? (
          <span className="badge-sale">-{calculateDiscount(product.originalPrice, product.price)}%</span>
        ) : null}
        {product.isNew && <span className="badge-new">New</span>}
      </div>

      {/* Hover Action Strip (Right side) */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
        <button 
          onClick={handleWishlist}
          className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-gray-50 transition-colors"
          aria-label="Add to Wishlist"
        >
          <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} className={isWishlisted ? "text-red-500" : ""} />
        </button>
        <button 
          className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-50 transition-colors"
          aria-label="Compare"
        >
          <ArrowRightLeft size={16} />
        </button>
        <button 
          className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-50 transition-colors"
          aria-label="Quick View"
        >
          <Eye size={16} />
        </button>
      </div>

      <Link href={`/products/${product.categorySlug}/${product.slug}`} className="block relative aspect-square p-4 flex-shrink-0">
        <Image
          src={product.images[0]?.url || `https://placehold.co/400x400/1E3A8A/FFFFFF?text=${encodeURIComponent(product.name)}`}
          alt={product.images[0]?.alt || product.name}
          fill
          className="object-contain p-2 mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        {/* Out of stock overlay bar (PCB Store style) */}
        {isOutOfStock && (
          <div className="absolute bottom-0 left-0 right-0 bg-red-100/95 backdrop-blur-sm text-red-700 text-xs font-bold py-1.5 text-center">
            Stock Out!
          </div>
        )}
      </Link>

      <div className="p-4 pt-2 flex flex-col flex-1 border-t border-gray-100">
        <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">
          {product.categoryName}
        </div>
        
        <Link 
          href={`/products/${product.categorySlug}/${product.slug}`}
          className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 hover:text-blue-600 transition-colors"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Short Specs (optional, can hide on mobile) */}
        <div className="text-xs text-gray-500 hidden sm:block mb-3 flex-1">
          {product.shortDescription}
        </div>
        <div className="sm:hidden flex-1"></div> {/* Spacer for mobile */}

        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="price-current">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="price-original">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-2 px-4 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              isOutOfStock 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-slate-900 text-white hover:bg-blue-600'
            }`}
          >
            <ShoppingCart size={16} />
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
