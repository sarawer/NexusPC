'use client';
// src/components/layout/Header.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Heart, Menu, Cpu, X, User, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import SearchBar from './SearchBar';
import { cn } from '@/lib/utils';
import { useIsAuthenticated, useIsClient } from '@/lib/authState';
import { categories } from '@/data/categories';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const hasMounted = useIsClient();
  const isSignedIn = useIsAuthenticated();
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const wishlistItems = useWishlistStore((state) => state.items);
  const openCart = useCartStore((state) => state.openCart);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
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
            <Link href={isSignedIn ? '/account' : '/login'} className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 p-2 rounded-md hover:bg-gray-50 transition-colors">
              <User size={20} />
              <span>{isSignedIn ? 'Account' : 'LOGIN / REGISTER'}</span>
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
        <div className="container-site flex items-center justify-between h-12">
          <div className="relative group h-full flex items-center">
            <Link href="/products" className="h-full px-5 bg-blue-600 hover:bg-blue-700 flex items-center gap-2 font-semibold transition-colors">
              <Menu size={19} /> All Categories <ChevronDown size={15} />
            </Link>
            <div className="hidden group-hover:block group-focus-within:block absolute left-0 top-full z-50 w-64 rounded-b-lg bg-white py-2 text-slate-800 shadow-xl">
              {categories.map((category) => <Link key={category.slug} href={`/products/${category.slug}`} className="block px-5 py-2 text-sm hover:bg-blue-50 hover:text-blue-700">{category.name}</Link>)}
            </div>
          </div>
          <div className="flex items-center justify-center gap-8 text-sm font-medium">
            <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
            <Link href="/products" className="hover:text-blue-400 transition-colors">Shop</Link>
            <Link href="/best-builds" className="hover:text-blue-400 transition-colors">Best Builds</Link>
          </div>
          <Link href="/pc-builder" className="h-full px-6 bg-orange-500 hover:bg-orange-600 flex items-center font-bold transition-colors">PC BUILDER</Link>
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
              <Link href="/products" className="p-2 font-medium border-b border-gray-100">Shop</Link>
              <Link href="/best-builds" className="p-2 font-medium border-b border-gray-100">Best Builds</Link>
              <Link href="/pc-builder" className="p-2 font-medium border-b border-gray-100">PC Builder</Link>
              <div className="pt-3 text-xs font-bold uppercase tracking-wide text-slate-400">All Categories</div>
              {categories.map((category) => <Link key={category.slug} href={`/products/${category.slug}`} className="p-2 pl-4 text-sm border-b border-gray-100">{category.name}</Link>)}
              {!isSignedIn && <Link href="/login" className="p-2 font-semibold text-blue-600">LOGIN / REGISTER</Link>}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
