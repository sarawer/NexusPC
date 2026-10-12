'use client';

import { FormEvent, useState } from 'react';
import { newsletterService } from '@/lib/services/newsletterService';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setIsError(false);
    try {
      const result = await newsletterService.subscribe(email);
      setMessage(result.message);
      setIsError(false);
      setEmail('');
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : 'Could not subscribe right now. Please try again.');
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex w-full max-w-md">
        <label htmlFor="newsletter-email" className="sr-only">Email address</label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          autoComplete="email"
          required
          maxLength={254}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          className="min-w-0 flex-1 rounded-l-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
        />
        <button type="submit" disabled={isSubmitting} className="shrink-0 rounded-r-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-wait disabled:opacity-60">
          {isSubmitting ? 'Joining…' : 'Subscribe'}
        </button>
      </form>
      {message && <p role="status" aria-live="polite" className={`mt-2 text-xs leading-5 ${isError ? 'text-rose-300' : 'text-emerald-300'}`}>{message}</p>}
    </div>
  );
}
