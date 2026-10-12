'use client';

import { FormEvent, useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Edit3 } from 'lucide-react';
import { authService, type User as AuthUser } from '@/lib/services/authService';
import { notify } from '@/components/ui/toast';

export default function AccountPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [editing, setEditing] = useState(false);
  useEffect(() => { authService.me().then(setUser).catch(() => undefined); }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const updated = await authService.updateProfile({ name: String(form.get('name')), phone: String(form.get('phone') || '') });
      setUser(updated);
      setEditing(false);
      notify.success('Profile updated successfully.');
    } catch {
      notify.error('Could not update your profile. Please try again.');
    }
  }

  if (!user) return <div className="bg-white rounded-xl p-8">Loading profile...</div>;
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100"><h2 className="text-xl font-bold text-gray-900">Personal Profile</h2><button type="button" onClick={() => setEditing(!editing)} className="inline-flex cursor-pointer items-center gap-2 rounded-lg p-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700"><Edit3 size={16} /> {editing ? 'Cancel' : 'Edit'}</button></div>
      {editing ? <form onSubmit={save} className="max-w-md space-y-4"><label className="block text-sm">Full Name<input name="name" defaultValue={user.name} required className="mt-1 w-full border rounded-lg p-2" /></label><label className="block text-sm">Phone<input name="phone" defaultValue={user.phone || ''} className="mt-1 w-full border rounded-lg p-2" /></label><button className="btn-primary">Save changes</button></form> :
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2"><div className="space-y-6"><div><p className="mb-1 flex gap-2 text-sm text-gray-500"><User size={14} /> Full Name</p><p className="break-words font-medium">{user.name}</p></div><div><p className="mb-1 flex gap-2 text-sm text-gray-500"><Mail size={14} /> Email Address</p><p className="break-all font-medium">{user.email}</p></div><div><p className="mb-1 flex gap-2 text-sm text-gray-500"><Phone size={14} /> Phone Number</p><p className="break-words font-medium">{user.phone || 'Not provided'}</p></div></div><div><h3 className="mb-4 flex items-center gap-2 font-bold"><MapPin size={18} className="shrink-0 text-blue-600" /> Default Shipping Address</h3><p className="text-sm text-gray-500">Manage shipping addresses during checkout.</p></div></div>}
    </div>
  );
}
