'use client';
// src/app/(customer)/account/wishlist/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { useWishlistStore, type WishlistItem } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { useEffect } from 'react';
import { wishlistService } from '@/lib/services/shopService';
import { notify } from '@/components/ui/toast';

export default function WishlistPage() {
  const { items, replaceItems } = useWishlistStore();
  const addItemToCart = useCartStore(state => state.addItem);
  useEffect(() => {
    wishlistService.list().then(replaceItems).catch(() => undefined);
  }, [replaceItems]);

  const handleAddToCart = (item: WishlistItem) => {
    addItemToCart({
      productId: item.productId,
      slug: item.slug,
      name: item.name,
      brand: item.brand,
      image: item.image,
      price: item.price,
      originalPrice: item.originalPrice,
      quantity: 1,
      stockCount: 10, // Assuming in stock for wishlist demo
      categoryName: item.categoryName,
    });
    notify.success('Added to cart', item.name);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100 flex items-center gap-2">
        <Heart size={20} className="text-red-500" fill="currentColor" /> My Wishlist
      </h2>
      
      {items.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart size={24} className="text-red-300" />
          </div>
          <p className="text-gray-500 mb-4">Your wishlist is empty.</p>
          <Link href="/products" className="btn-primary">Explore Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((item) => {
            const isOutOfStock = item.stockStatus === 'out_of_stock';
            
            return (
              <div key={item.productId} className="border border-gray-200 rounded-lg p-4 flex flex-col relative group">
                <button 
                  onClick={async () => {
                    try {
                      const savedItems = await wishlistService.remove(item.productId);
                      replaceItems(savedItems);
                      notify.success('Removed from wishlist', item.name);
                    } catch {
                      notify.error('Could not remove this item from your wishlist.');
                    }
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors z-10 opacity-0 group-hover:opacity-100"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 size={16} />
                </button>
                
                <div className="flex gap-4 mb-4">
                  <Link href={`/products/${item.categoryName.toLowerCase()}/${item.slug}`} className="w-20 h-20 bg-gray-50 rounded-md border border-gray-100 relative flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-2 mix-blend-multiply" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">{item.categoryName}</p>
                    <Link href={`/products/${item.categoryName.toLowerCase()}/${item.slug}`} className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                      {item.name}
                    </Link>
                  </div>
                </div>
                
                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="font-bold text-blue-700">{formatPrice(item.price)}</span>
                  <button 
                    onClick={() => handleAddToCart(item)}
                    disabled={isOutOfStock}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-slate-900 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:bg-gray-200 disabled:text-gray-500"
                  >
                    <ShoppingCart size={14} />
                    {isOutOfStock ? 'Stock Out' : 'Add'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
