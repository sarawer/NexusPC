import { apiFetch, API_BASE_URL } from '@/lib/api';
import type { Order, OrderStatus } from '@/types/order';

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
  createdAt: string;
}

export interface PromoCode {
  id: number; code: string; discountType: 'FIXED' | 'PERCENTAGE'; discountValue: number;
  minimumOrderAmount: number; startsAt: string; endsAt: string;
}

export interface PromoCodeInput {
  code: string; discountType: 'FIXED' | 'PERCENTAGE'; discountValue: number;
  minimumOrderAmount: number; startsAt: string; endsAt: string;
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
  users: () => apiFetch<AdminUser[]>('/admin/customers'),
  promoCodes: () => apiFetch<PromoCode[]>('/admin/promo-codes'),
  orders: () => apiFetch<Order[]>('/admin/orders'),
  updateOrderStatus: (id: number | string, status: OrderStatus) => apiFetch<Order>(`/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  createPromoCode: (input: PromoCodeInput) => apiFetch<PromoCode>('/admin/promo-codes', { method: 'POST', body: JSON.stringify(input) }),
  updatePromoCode: (id: number, input: PromoCodeInput) => apiFetch<PromoCode>(`/admin/promo-codes/${id}`, { method: 'PUT', body: JSON.stringify(input) }),
  deletePromoCode: (id: number) => apiFetch<void>(`/admin/promo-codes/${id}`, { method: 'DELETE' }),
  changeUserRole: (id: number, role: 'CUSTOMER' | 'ADMIN', currentPassword: string) =>
    apiFetch<AdminUser>(`/admin/customers/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role, currentPassword }),
    }),
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
