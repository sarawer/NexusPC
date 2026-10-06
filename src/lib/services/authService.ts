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
  me: () => apiFetch<User>('/auth/me'),
  updateProfile: (input: { name: string; phone?: string }) =>
    apiFetch<User>('/auth/me', { method: 'PUT', body: JSON.stringify(input) }),
  logout: () => setAuthToken(null),
};
