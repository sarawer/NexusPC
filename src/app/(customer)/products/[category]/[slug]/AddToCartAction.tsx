'use client';
// src/app/(customer)/products/[category]/[slug]/AddToCartAction.tsx
import { useState } from 'react';
import { Minus, Plus, ShoppingCart, Heart } from 'lucide-react';
import type { Product } from '@/types/product';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { cartService, wishlistService } from '@/lib/services/shopService';

interface AddToCartActionProps {
  product: Product;
}

export default function AddToCartAction({ product }: AddToCartActionProps) {
  const [quantity, setQuantity] = useState(1);
  const addItemToCart = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const { items: wishlistItems, toggleItem: toggleWishlist } = useWishlistStore();

  const isOutOfStock = product.stockStatus === 'out_of_stock' || product.stockCount === 0;
  const isWishlisted = wishlistItems.some((item) => item.productId === product.id);

  const handleQuantityChange = (delta: number) => {
    const next = quantity + delta;
    if (next > 0 && next <= product.stockCount) {
      setQuantity(next);
    }
  };

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    
    addItemToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      image: product.images[0]?.url || '',
      price: product.price,
      originalPrice: product.originalPrice,
      quantity,
      stockCount: product.stockCount,
      categoryName: product.categoryName,
    });
    
    openCart();
    try {
      await cartService.add(product.id, quantity);
    } catch {
      // Keep the local cart usable for guests or when the API is unavailable.
    }
  };

  const handleWishlist = () => {
    const wasWishlisted = isWishlisted;
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
    const request = wasWishlisted ? wishlistService.remove(product.id) : wishlistService.add(product.id);
    request.catch(() => undefined);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Quantity Selector */}
      <div className="flex items-center justify-between border-2 border-gray-200 rounded-lg w-full sm:w-32 bg-white flex-shrink-0 h-14">
        <button 
          onClick={() => handleQuantityChange(-1)}
          disabled={quantity <= 1 || isOutOfStock}
          className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:hover:bg-transparent rounded-l-md"
          aria-label="Decrease quantity"
        >
          <Minus size={18} />
        </button>
        <span className="w-10 text-center font-bold text-gray-900 select-none">
          {quantity}
        </span>
        <button 
          onClick={() => handleQuantityChange(1)}
          disabled={quantity >= product.stockCount || isOutOfStock}
          className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:hover:bg-transparent rounded-r-md"
          aria-label="Increase quantity"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-1 gap-4">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`flex-1 h-14 rounded-lg font-bold text-base flex items-center justify-center gap-3 transition-all ${
            isOutOfStock
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5'
          }`}
        >
          <ShoppingCart size={20} />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
        
        <button 
          onClick={handleWishlist}
          className={`w-14 h-14 rounded-lg flex items-center justify-center transition-all flex-shrink-0 border-2 ${
            isWishlisted
              ? 'border-red-100 bg-red-50 text-red-500 hover:bg-red-100'
              : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50'
          }`}
          aria-label="Add to wishlist"
        >
          <Heart size={22} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </div>
    </div>
  );
}
