import { apiFetch } from '@/lib/api';

export interface SavedBuild {
  id: number;
  name: string;
  components: Record<string, number>;
  total: number;
  compatible: boolean;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export const pcBuilderService = {
  save: (name: string, components: Record<string, number>) =>
    apiFetch<SavedBuild>('/pc-builder/builds', {
      method: 'POST',
      body: JSON.stringify({ name, components }),
    }),
};
