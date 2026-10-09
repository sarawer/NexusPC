import { apiFetch } from '@/lib/api';
import type { Category } from '@/types/product';

export const categoryService = {
  list: () => apiFetch<Category[]>('/categories'),
};
