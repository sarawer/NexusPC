import { apiFetch } from '@/lib/api';
import type { Product, ProductFilters, SortOption } from '@/types/product';

interface ProductPage { content: BackendProduct[]; totalPages?: number; }
interface BackendProduct extends Omit<Product, 'id' | 'images' | 'specifications'> {
  id: number | string;
  images?: { id: string; url: string; alt: string }[];
  specifications?: Record<string, string>;
}

const toProduct = (item: BackendProduct): Product => ({
  ...item,
  id: String(item.id),
  images: item.images ?? [],
  specifications: Object.entries(item.specifications ?? {}).map(([label, value]) => ({ label, value })),
  price: Number(item.price),
  originalPrice: item.originalPrice == null ? undefined : Number(item.originalPrice),
});

async function list(params = '') {
  try {
    const result = await apiFetch<ProductPage | BackendProduct[]>(`/products${params}`);
    if (Array.isArray(result)) return result.map(toProduct);
    const query = new URLSearchParams(params.replace(/^\?/, ''));
    const pageCount = query.get('size') === '100' ? Math.min(result.totalPages ?? 1, 100) : 1;
    if (pageCount <= 1) return result.content.map(toProduct);
    const remaining = await Promise.all(Array.from({ length: pageCount - 1 }, async (_, index) => {
      const pageQuery = new URLSearchParams(query);
      pageQuery.set('page', String(index + 1));
      const page = await apiFetch<ProductPage | BackendProduct[]>(`/products?${pageQuery}`);
      if (Array.isArray(page)) return page;
      return page.content;
    }));
    return [...result.content, ...remaining.flat()].map(toProduct);
  } catch {
    // Product pages can still render an empty state while the API is unavailable.
    return [];
  }
}

export const productService = {
  getAll: () => list('?size=100'),
  async getBySlug(slug: string) {
    try { return toProduct(await apiFetch<BackendProduct>(`/products/slug/${encodeURIComponent(slug)}`)); }
    catch { return null; }
  },
  async getById(id: string) {
    try { return toProduct(await apiFetch<BackendProduct>(`/products/${encodeURIComponent(id)}`)); }
    catch { return null; }
  },
  getByCategory: async (categorySlug: string) => {
    if (categorySlug !== 'storage') return list(`?category=${encodeURIComponent(categorySlug)}&size=100`);
    const [ssds, hardDrives] = await Promise.all([list('?category=ssd&size=100'), list('?category=hdd&size=100')]);
    return [...ssds, ...hardDrives];
  },
  getFeatured: (limit = 20) => list(`/featured?size=${limit}`),
  getBestsellers: (limit = 20) => list(`/bestsellers?size=${limit}`),
  getNew: (limit = 20) => list(`/new?size=${limit}`),
  async getRelated(product: Product, limit = 4) {
    return (await list(`?category=${encodeURIComponent(product.categorySlug)}&size=${limit + 1}`))
      .filter((item) => item.id !== product.id).slice(0, limit);
  },
  search: (query: string) => list(`?q=${encodeURIComponent(query)}&size=100`),
  async filter(filters: ProductFilters, sort: SortOption = 'featured') {
    const params = new URLSearchParams({ size: '100' });
    if (filters.query) params.set('q', filters.query);
    const categories = filters.categorySlug === 'storage' ? ['ssd', 'hdd'] : filters.categorySlug ? [filters.categorySlug] : [undefined];
    if (categories.length === 1 && categories[0]) params.set('category', categories[0]);
    if (filters.brands?.length) params.set('brand', filters.brands[0]);
    if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
    if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
    if (filters.isNew !== undefined) params.set('new', String(filters.isNew));
    const sortMap: Record<SortOption, string> = {
      featured: 'createdAt,desc', price_asc: 'price,asc', price_desc: 'price,desc',
      rating: 'rating,desc', newest: 'createdAt,desc', name_asc: 'name,asc',
    };
    params.set('sort', sortMap[sort]);
    let result = categories.length > 1
      ? (await Promise.all(categories.map((category) => {
        const categoryParams = new URLSearchParams(params);
        if (category) categoryParams.set('category', category);
        return list(`?${categoryParams}`);
      }))).flat()
      : await list(`?${params}`);
    if (categories.length > 1) {
      const sorters: Partial<Record<SortOption, (a: Product, b: Product) => number>> = {
        price_asc: (a, b) => a.price - b.price,
        price_desc: (a, b) => b.price - a.price,
        name_asc: (a, b) => a.name.localeCompare(b.name),
        rating: (a, b) => b.rating - a.rating,
        newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
      };
      result.sort(sorters[sort] ?? ((a, b) => b.createdAt.localeCompare(a.createdAt)));
    }
    if (filters.brands && filters.brands.length > 1) result = result.filter((p) => filters.brands!.includes(p.brand));
    if (filters.stockStatus?.length) result = result.filter((p) => filters.stockStatus!.includes(p.stockStatus));
    if (filters.minRating !== undefined) result = result.filter((p) => p.rating >= filters.minRating!);
    return result;
  },
};
