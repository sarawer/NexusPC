'use client';

import { useSyncExternalStore } from 'react';
import { getAuthToken } from '@/lib/api';

function subscribeAuthChange(listener: () => void) {
  window.addEventListener('nexuspc-auth-change', listener);
  window.addEventListener('storage', listener);
  return () => {
    window.removeEventListener('nexuspc-auth-change', listener);
    window.removeEventListener('storage', listener);
  };
}

export function useIsAuthenticated() {
  return useSyncExternalStore(subscribeAuthChange, () => Boolean(getAuthToken()), () => false);
}

export function useIsClient() {
  return useSyncExternalStore(() => () => undefined, () => true, () => false);
}
