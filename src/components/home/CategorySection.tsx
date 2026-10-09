// src/components/home/CategorySection.tsx
import CategoryCard from '@/components/ui/CategoryCard';
import { categoryService } from '@/lib/services/categoryService';

export default async function CategorySection() {
  let displayCategories = [];
  try {
    const categories = await categoryService.list();
    displayCategories = categories.slice(0, 12);
  } catch {
    displayCategories = [];
  }

  return (
    <section className="py-16 bg-white">
      <div className="container-site">
        <div className="section-header">
          <h2 className="section-title">Shop by Category</h2>
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
