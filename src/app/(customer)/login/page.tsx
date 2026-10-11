'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services/authService';
import { notify } from '@/components/ui/toast';

export default function LoginPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
      await authService.login(String(form.get('email')), String(form.get('password')));
      notify.success('Signed in successfully.');
      router.push('/');
      router.refresh();
    } catch (reason) {
      notify.error(reason instanceof Error ? reason.message : 'Unable to sign in.');
      setSubmitting(false);
    }
  }

  return (
    <main className="container-site max-w-md py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h1>
      <p className="text-gray-500 mb-8">Access your NexusPC account.</p>
      <form onSubmit={submit} className="space-y-5 bg-white border rounded-xl p-6 shadow-sm">
        <label className="block text-sm font-medium text-gray-700">
          Email
          <input name="email" type="email" required className="mt-2 w-full rounded-lg border px-3 py-2" />
        </label>
        <div className="block text-sm font-medium text-gray-700">
          <label htmlFor="login-password">Password</label>
          <div className="relative mt-2">
            <input
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              className="w-full rounded-lg border px-3 py-2 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 transition-colors hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
            </button>
          </div>
        </div>
        <div className="-mt-3 text-right">
          <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:underline">Forgot password?</Link>
        </div>
        <button disabled={submitting} className="btn-primary w-full disabled:opacity-50">
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
        <p className="text-sm text-gray-600">
          New customer? <Link href="/register" className="text-blue-600 hover:underline">Create an account</Link>
        </p>
      </form>
    </main>
  );
}
