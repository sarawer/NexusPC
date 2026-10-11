'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { authService } from '@/lib/services/authService';

export default function ForgotPasswordPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      await authService.requestPasswordReset(String(form.get('email')).trim());
      setSubmitted(true);
    } catch {
      setError('We could not submit your request right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="container-site max-w-md py-16">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Forgot password?</h1>
      <p className="mb-8 text-gray-500">Enter your account email and we’ll send a reset link if it’s eligible.</p>
      <form onSubmit={submit} className="space-y-5 rounded-xl border bg-white p-6 shadow-sm">
        {submitted ? (
          <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            If an eligible account exists, a password reset link will be sent. Check your inbox and spam folder.
          </div>
        ) : (
          <>
            <label className="block text-sm font-medium text-gray-700">
              Email
              <input name="email" type="email" autoComplete="email" required maxLength={254} className="mt-2 w-full rounded-lg border px-3 py-2" />
            </label>
            {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <button disabled={submitting} className="btn-primary w-full disabled:opacity-50">
              {submitting ? 'Sending…' : 'Send reset link'}
            </button>
          </>
        )}
        <p className="text-sm text-gray-600"><Link href="/login" className="font-medium text-blue-600 hover:underline">Back to sign in</Link></p>
      </form>
    </main>
  );
}
