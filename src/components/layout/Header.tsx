'use client';
// src/components/layout/Header.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Heart, User, Menu, Cpu, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import SearchBar from './SearchBar';
import AnnouncementBar from './AnnouncementBar';
import { cn } from '@/lib/utils';
import { categories } from '@/data/categories';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const wishlistItems = useWishlistStore((state) => state.items);
  const openCart = useCartStore((state) => state.openCart);

  useEffect(() => {
    setHasMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }

  return (
    <header className="w-full flex flex-col relative z-50">
      <AnnouncementBar />

      {/* Main Header */}
      <div className={cn("bg-white transition-shadow", isScrolled ? "shadow-md sticky top-0" : "")}>
        <div className="container-site py-4 flex items-center justify-between gap-4 lg:gap-8">
          
          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 -ml-2 text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Cpu size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">Nexus<span className="text-blue-600">PC</span></span>
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest leading-none mt-1">Build Your Dream</span>
            </div>
          </Link>

          {/* Search (Desktop) */}
          <div className="hidden lg:block flex-1 max-w-2xl mx-auto">
            <SearchBar />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <Link href="/account" className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 p-2 rounded-md hover:bg-gray-50 transition-colors">
              <User size={20} />
              <span className="hidden xl:block">Account</span>
            </Link>
            
            <Link href="/account/wishlist" className="relative p-2 text-gray-700 hover:text-blue-600 rounded-md hover:bg-gray-50 transition-colors">
              <Heart size={20} />
              {hasMounted && wishlistItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center translate-x-1/4 -translate-y-1/4">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <button onClick={openCart} className="relative p-2 text-gray-700 hover:text-blue-600 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2">
              <ShoppingCart size={20} />
              {hasMounted && cartItemCount > 0 && (
                <span className="absolute top-0 right-0 lg:static lg:bg-transparent lg:text-inherit bg-blue-600 text-white text-[10px] lg:text-sm font-bold h-4 w-4 lg:h-auto lg:w-auto rounded-full flex items-center justify-center translate-x-1/4 -translate-y-1/4 lg:translate-x-0 lg:translate-y-0">
                  {cartItemCount}
                </span>
              )}
              <span className="hidden lg:block font-medium">Cart</span>
            </button>
          </div>
        </div>

        {/* Search (Mobile) */}
        <div className="lg:hidden container-site pb-3">
          <SearchBar />
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-slate-900 text-white hidden lg:block">
        <div className="container-site flex items-center h-12">
          {/* Categories Dropdown Trigger - Could be a complex mega menu later */}
          <div className="relative group h-full flex items-center cursor-pointer">
            <div className="bg-blue-600 h-full flex items-center px-4 font-semibold gap-2">
              <Menu size={18} />
              All Categories
            </div>
            
            {/* Simple Mega Menu for now */}
            <div className="absolute top-full left-0 w-[250px] bg-white border border-gray-200 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 rounded-b-lg overflow-hidden">
               {categories.slice(0, 10).map((cat) => (
                  <Link key={cat.id} href={`/products/${cat.slug}`} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-b border-gray-100 last:border-0">
                    {cat.name}
                  </Link>
               ))}
               <Link href="/products" className="block px-4 py-3 text-sm text-blue-600 font-semibold bg-gray-50 hover:bg-gray-100 text-center">
                 View All Categories
               </Link>
            </div>
          </div>

          <div className="flex-1 flex justify-center gap-8 text-sm font-medium">
            <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
            <Link href="/products" className="hover:text-blue-400 transition-colors">Shop</Link>
            <Link href="/products/gpu" className="hover:text-blue-400 transition-colors">Graphics Cards</Link>
            <Link href="/products/monitor" className="hover:text-blue-400 transition-colors">Monitors</Link>
            <Link href="/products/accessories" className="hover:text-blue-400 transition-colors">Accessories</Link>
          </div>

          <div className="flex items-center">
            <Link href="/pc-builder" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-5 h-12 flex items-center font-bold tracking-wide transition-all uppercase text-sm">
              PC Builder
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-0 left-0 bottom-0 w-[280px] bg-white shadow-xl flex flex-col">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <span className="font-bold text-lg">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)}><X size={20} /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-4 flex flex-col gap-2">
              <Link href="/" className="p-2 font-medium border-b border-gray-100">Home</Link>
              <Link href="/pc-builder" className="p-2 font-bold text-orange-600 border-b border-gray-100">PC Builder</Link>
              <Link href="/products" className="p-2 font-medium border-b border-gray-100">All Products</Link>
              <div className="p-2 mt-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Categories</div>
              {categories.map((cat) => (
                <Link key={cat.id} href={`/products/${cat.slug}`} className="p-2 text-sm text-gray-700 pl-4">
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
