import { apiFetch } from '@/lib/api';
import type { Product, ProductFilters, SortOption } from '@/types/product';

interface ProductPage { content: BackendProduct[]; }
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
    return (Array.isArray(result) ? result : result.content).map(toProduct);
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
  getByCategory: (categorySlug: string) => list(`?category=${encodeURIComponent(categorySlug)}&size=100`),
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
    if (filters.categorySlug) params.set('category', filters.categorySlug);
    if (filters.brands?.length) params.set('brand', filters.brands[0]);
    if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
    if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
    if (filters.isNew !== undefined) params.set('new', String(filters.isNew));
    const sortMap: Record<SortOption, string> = {
      featured: 'createdAt,desc', price_asc: 'price,asc', price_desc: 'price,desc',
      rating: 'rating,desc', newest: 'createdAt,desc', name_asc: 'name,asc',
    };
    params.set('sort', sortMap[sort]);
    let result = await list(`?${params}`);
    if (filters.brands && filters.brands.length > 1) result = result.filter((p) => filters.brands!.includes(p.brand));
    if (filters.stockStatus?.length) result = result.filter((p) => filters.stockStatus!.includes(p.stockStatus));
    if (filters.minRating !== undefined) result = result.filter((p) => p.rating >= filters.minRating!);
    return result;
  },
};
