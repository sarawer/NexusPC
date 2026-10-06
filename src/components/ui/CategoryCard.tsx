// src/components/ui/CategoryCard.tsx
import Link from 'next/link';
import * as Icons from 'lucide-react';
import type { Category } from '@/types/product';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export default function CategoryCard({ category, className }: CategoryCardProps) {
  // Dynamically resolve icon from Lucide
  const IconComponent = (Icons as unknown as Record<string, React.ElementType>)[category.icon] || Icons.Box;

  return (
    <Link 
      href={`/products/${category.slug}`}
      className={cn(
        "flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all duration-200 group text-center gap-3",
        className
      )}
    >
      <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
        <IconComponent size={28} strokeWidth={1.5} />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{category.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{category.productCount} items</p>
      </div>
    </Link>
  );
}
