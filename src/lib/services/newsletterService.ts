import { apiFetch } from '@/lib/api';

export interface NewsletterSubscriber {
  id: number;
  email: string;
  subscribedAt: string;
}

export const newsletterService = {
  subscribe: (email: string) => apiFetch<{ message: string; alreadySubscribed: boolean }>('/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
};
