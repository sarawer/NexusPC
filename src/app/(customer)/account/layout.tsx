'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { User, Package, Heart, LogOut, KeyRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authService, type User as AuthUser } from '@/lib/services/authService';
import { notify } from '@/components/ui/toast';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    authService.me().then(setUser).catch(() => router.replace('/login'));
  }, [router]);

  function logout() {
    authService.logout();
    notify.success('Signed out successfully.');
    router.replace('/login');
  }

  const initials = user?.name?.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || '?';
  return (
    <div className="bg-slate-50 min-h-[calc(100vh-200px)] py-8">
      <div className="container-site">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="p-6 border-b border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">{initials}</div>
                <div className="min-w-0"><h3 className="font-bold text-gray-900 truncate">{user?.name || 'Loading...'}</h3><p className="text-xs text-gray-500 truncate">{user?.email || ''}</p></div>
              </div>
              <nav className="p-2">
                <Link href="/account" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"><User size={18} /> Profile</Link>
                <Link href="/account/orders" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"><Package size={18} /> My Orders</Link>
                <Link href="/account/wishlist" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"><Heart size={18} /> Wishlist</Link>
                <Link href="/account/change-password" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"><KeyRound size={18} /> Reset password</Link>
                {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-lg">Admin panel</Link>}
                <button onClick={logout} className="w-full flex cursor-pointer items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg mt-2 border-t border-gray-100 transition-colors"><LogOut size={18} /> Logout</button>
              </nav>
            </div>
          </div>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
