'use client';

import { FormEvent, useState } from 'react';
import { KeyRound } from 'lucide-react';
import { authService } from '@/lib/services/authService';
import { notify } from '@/components/ui/toast';

const inputClass = 'mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

export default function ChangePasswordPage() {
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const currentPassword = String(data.get('currentPassword'));
    const newPassword = String(data.get('newPassword'));
    if (newPassword !== String(data.get('confirmPassword'))) {
      notify.error('New passwords do not match.');
      return;
    }
    if (newPassword === currentPassword) {
      notify.error('Choose a password you have not used for this account.');
      return;
    }

    setSubmitting(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      form.reset();
      notify.success('Password updated successfully.');
    } catch (reason) {
      notify.error(reason instanceof Error ? reason.message : 'Could not update your password.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5">
        <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600"><KeyRound size={20} /></div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Reset password</h1>
          <p className="mt-1 text-sm text-gray-500">Confirm your current password, then choose a new one.</p>
        </div>
      </div>
      <form onSubmit={submit} className="max-w-lg space-y-5">
        <label className="block text-sm font-medium text-gray-700">
          Current password
          <input name="currentPassword" type="password" autoComplete="current-password" required className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          New password
          <input name="newPassword" type="password" autoComplete="new-password" minLength={8} maxLength={128} required className={inputClass} />
          <span className="mt-1 block text-xs font-normal text-gray-500">Use at least 8 characters.</span>
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Confirm new password
          <input name="confirmPassword" type="password" autoComplete="new-password" minLength={8} maxLength={128} required className={inputClass} />
        </label>
        <button type="submit" disabled={submitting} className="btn-primary disabled:cursor-wait disabled:opacity-50">
          {submitting ? 'Updating password…' : 'Update password'}
        </button>
      </form>
    </section>
  );
}
