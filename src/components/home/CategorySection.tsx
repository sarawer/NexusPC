// src/components/home/CategorySection.tsx
import CategoryCard from '@/components/ui/CategoryCard';
import { categoryService } from '@/lib/services/categoryService';
import type { Category } from '@/types/product';
import { categories as fallbackCategories } from '@/data/categories';

export default async function CategorySection() {
  let displayCategories: Category[] = [];
  try {
    const categories = await categoryService.list();
    const visible = categories.filter((category) => !['cpu-cooler', 'case-fan', 'hdd'].includes(category.slug));
    const ssd = visible.find((category) => category.slug === 'ssd');
    displayCategories = visible.map((category) => category.slug === 'ssd' ? {
      ...category,
      slug: 'storage',
      name: 'Storage',
      description: 'SSD and hard drive storage for your PC',
      productCount: (category.productCount || 0) + (categories.find((item) => item.slug === 'hdd')?.productCount || 0),
    } : category);
    if (!displayCategories.some((category) => category.slug === 'mouse')) {
      displayCategories.push({ id: 'mouse', slug: 'mouse', name: 'Mouse', description: 'Mice for gaming and everyday use', icon: 'Mouse', productCount: 0 });
    }
    if (!ssd) displayCategories = displayCategories.filter((category) => category.slug !== 'storage');
    displayCategories = displayCategories.slice(0, 12);
  } catch {
    displayCategories = fallbackCategories;
  }

  return (
    <section className="bg-white py-12 sm:py-14 lg:py-16">
      <div className="container-site">
        <div className="mb-6 flex flex-col gap-2 sm:mb-8">
          <h2 className="section-title">Shop by Category</h2>
          <p className="pl-3 text-sm text-slate-500">Browse popular components and accessories for your setup.</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {displayCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
