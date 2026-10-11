'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services/authService';

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [complete, setComplete] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    const password = String(form.get('password'));
    if (password !== String(form.get('confirmPassword'))) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      await authService.resetPassword(token, password);
      setComplete(true);
      window.history.replaceState(null, '', '/reset-password');
      window.setTimeout(() => router.push('/login'), 1800);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'This password reset link is invalid or expired.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="container-site max-w-md py-16">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Choose a new password</h1>
      <p className="mb-8 text-gray-500">Use at least 8 characters for your new password.</p>
      <form onSubmit={submit} className="space-y-5 rounded-xl border bg-white p-6 shadow-sm">
        {complete ? (
          <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">Your password has been reset. Redirecting you to sign in…</div>
        ) : !token ? (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">This password reset link is invalid or expired.</div>
        ) : (
          <>
            <label className="block text-sm font-medium text-gray-700">
              New password
              <input name="password" type="password" autoComplete="new-password" minLength={8} maxLength={128} required className="mt-2 w-full rounded-lg border px-3 py-2" />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Confirm new password
              <input name="confirmPassword" type="password" autoComplete="new-password" minLength={8} maxLength={128} required className="mt-2 w-full rounded-lg border px-3 py-2" />
            </label>
            {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <button disabled={submitting} className="btn-primary w-full disabled:opacity-50">{submitting ? 'Updating…' : 'Reset password'}</button>
          </>
        )}
        <p className="text-sm text-gray-600"><Link href="/login" className="font-medium text-blue-600 hover:underline">Back to sign in</Link></p>
      </form>
    </main>
  );
}
