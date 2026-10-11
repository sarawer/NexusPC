import { apiFetch, setAuthToken } from '@/lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

interface AuthResponse { token: string; user: User }

export const authService = {
  async login(email: string, password: string) {
    const result = await apiFetch<AuthResponse>('/auth/login', {
      method: 'POST', body: JSON.stringify({ email, password }),
    });
    setAuthToken(result.token);
    return result.user;
  },
  async register(input: Record<string, unknown>) {
    const result = await apiFetch<AuthResponse>('/auth/register', {
      method: 'POST', body: JSON.stringify(input),
    });
    setAuthToken(result.token);
    return result.user;
  },
  requestPasswordReset: (email: string) =>
    apiFetch<{ message: string }>('/auth/forgot-password', {
      method: 'POST', body: JSON.stringify({ email }),
    }),
  resetPassword: (token: string, newPassword: string) =>
    apiFetch<{ message: string }>('/auth/reset-password', {
      method: 'POST', body: JSON.stringify({ token, newPassword }),
    }),
  changePassword: (currentPassword: string, newPassword: string) =>
    apiFetch<{ message: string }>('/auth/change-password', {
      method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }),
    }),
  me: () => apiFetch<User>('/auth/me'),
  updateProfile: (input: { name: string; phone?: string }) =>
    apiFetch<User>('/auth/me', { method: 'PUT', body: JSON.stringify(input) }),
  logout: () => setAuthToken(null),
};
