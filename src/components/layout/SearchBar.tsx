'use client';
// src/components/layout/SearchBar.tsx
import { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { searchProducts } from '@/data/products';

import { formatPrice } from '@/lib/utils';

const POPULAR_SEARCHES = ['RTX 4090', 'Ryzen 9 7950X', 'DDR5 RAM', 'NVMe SSD', '240Hz Monitor'];

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Derive results during render to avoid cascading updates in useEffect
  const results = query.length >= 2 ? searchProducts(query).slice(0, 5) : [];

  useEffect(() => {
    const saved = localStorage.getItem('nexuspc-recent-searches');
    if (saved) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    saveRecentSearch(query.trim());
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setIsOpen(false);
    setQuery('');
  };

  const saveRecentSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('nexuspc-recent-searches', JSON.stringify(updated));
  };

  const handleSuggestionClick = (term: string) => {
    saveRecentSearch(term);
    router.push(`/search?q=${encodeURIComponent(term)}`);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for products, brands, categories..."
          className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
          aria-label="Search products"
          aria-expanded={isOpen}
          aria-controls="search-results-popup"
          aria-haspopup="listbox"
          role="combobox"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-0 top-0 bottom-0 px-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
          aria-label="Search"
        >
          <Search size={15} />
        </button>
      </form>

      {/* Dropdown */}
      {isOpen && (
        <div id="search-results-popup" className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          {/* Product results */}
          {results.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                Products
              </div>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.categorySlug}/${product.slug}`}
                  onClick={() => { saveRecentSearch(product.name); setIsOpen(false); setQuery(''); }}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors group"
                >
                  <div className="w-9 h-9 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0 text-xs text-gray-400">
                    📦
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-700">
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-500">{product.categoryName}</div>
                  </div>
                  <div className="text-sm font-semibold text-blue-700 flex-shrink-0">
                    {formatPrice(product.price)}
                  </div>
                </Link>
              ))}
              <div className="border-t border-gray-100">
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={() => { saveRecentSearch(query); setIsOpen(false); setQuery(''); }}
                  className="flex items-center justify-between px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors font-medium"
                >
                  View all results for &ldquo;{query}&rdquo;
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}

          {/* Empty results */}
          {query.length >= 2 && results.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              No products found for &ldquo;{query}&rdquo;
            </div>
          )}

          {/* Default state — recents + popular */}
          {query.length < 2 && (
            <div>
              {recentSearches.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100 flex items-center gap-1.5">
                    <Clock size={11} /> Recent
                  </div>
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSuggestionClick(term)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <Clock size={13} className="text-gray-400" />
                      {term}
                    </button>
                  ))}
                </div>
              )}
              <div>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100 flex items-center gap-1.5">
                  <TrendingUp size={11} /> Popular
                </div>
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSuggestionClick(term)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <TrendingUp size={13} className="text-gray-400" />
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
