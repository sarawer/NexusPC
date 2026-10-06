import { apiFetch, API_BASE_URL } from '@/lib/api';

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface ProductInput {
  slug: string;
  name: string;
  brand: string;
  sku: string;
  categoryId: number;
  description?: string;
  shortDescription?: string;
  images?: { url: string; alt: string }[];
  price: number;
  originalPrice?: number;
  stockCount: number;
  rating: number;
  reviewCount: number;
  warranty?: string;
  specifications?: Record<string, string>;
  tags?: string[];
  featured: boolean;
  bestseller: boolean;
  isNew: boolean;
}

export const adminService = {
  categories: () => apiFetch<Category[]>('/categories'),
  createCategory: (input: { name: string; slug: string; description?: string }) =>
    apiFetch<Category>('/admin/categories', { method: 'POST', body: JSON.stringify(input) }),
  createProduct: (input: ProductInput) =>
    apiFetch('/admin/products', { method: 'POST', body: JSON.stringify(input) }),
  uploadImage: async (file: File) => {
    const form = new FormData();
    form.append('file', file);
    const result = await apiFetch<{ url: string }>('/admin/uploads/image', { method: 'POST', body: form });
    return { url: result.url.startsWith('http') ? result.url : `${API_BASE_URL.replace(/\/api$/, '')}${result.url}` };
  },
};
