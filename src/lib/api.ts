const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api').replace(/\/$/, '');
const TOKEN_KEY = 'nexuspc-token';

function extractErrorMessage(body: string, fallback: string) {
  if (!body.trim()) return fallback;

  try {
    const payload: unknown = JSON.parse(body);
    if (typeof payload === 'string') return payload;
    if (payload && typeof payload === 'object') {
      const record = payload as Record<string, unknown>;
      for (const key of ['message', 'detail', 'title', 'error']) {
        const value = record[key];
        if (typeof value === 'string' && value.trim()) {
          try {
            const nested = JSON.parse(value);
            if (nested && typeof nested === 'object' && typeof (nested as Record<string, unknown>).message === 'string') {
              return (nested as Record<string, string>).message;
            }
          } catch {
            // The response field is already a readable message.
          }
          return value;
        }
      }
    }
  } catch {
    return body;
  }

  return body;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function getAuthToken() {
  return typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const token = getAuthToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers, cache: 'no-store' });
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new ApiError(response.status, extractErrorMessage(body, response.statusText));
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export { API_BASE_URL };
