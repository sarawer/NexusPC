'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services/authService';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
      await authService.register({
        name: String(form.get('name')),
        email: String(form.get('email')),
        phone: String(form.get('phone') || ''),
        password: String(form.get('password')),
      });
      router.push('/account');
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to create your account.');
      setSubmitting(false);
    }
  }

  return (
    <main className="container-site max-w-md py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h1>
      <p className="text-gray-500 mb-8">Join NexusPC and manage your orders.</p>
      <form onSubmit={submit} className="space-y-5 bg-white border rounded-xl p-6 shadow-sm">
        <label className="block text-sm font-medium text-gray-700">
          Name
          <input name="name" required maxLength={120} className="mt-2 w-full rounded-lg border px-3 py-2" />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Email
          <input name="email" type="email" required className="mt-2 w-full rounded-lg border px-3 py-2" />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Phone
          <input name="phone" type="tel" maxLength={30} className="mt-2 w-full rounded-lg border px-3 py-2" />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Password
          <input name="password" type="password" minLength={8} required className="mt-2 w-full rounded-lg border px-3 py-2" />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={submitting} className="btn-primary w-full disabled:opacity-50">
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
        <p className="text-sm text-gray-600">
          Already registered? <Link href="/login" className="text-blue-600 hover:underline">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
