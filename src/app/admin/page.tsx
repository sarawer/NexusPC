'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImagePlus, LayoutDashboard, PackagePlus, Search, ShieldCheck, Tags, Ticket, UploadCloud, Users, Pencil, Trash2, X, ClipboardList } from 'lucide-react';
import { adminService, type AdminUser, type Category, type PromoCode } from '@/lib/services/adminService';
import { authService, type User } from '@/lib/services/authService';
import { notify } from '@/components/ui/toast';
import type { Order, OrderStatus } from '@/types/order';
import { formatDate, formatPrice } from '@/lib/utils';

type PromoDraft = { code: string; discountType: 'FIXED' | 'PERCENTAGE'; discountValue: string; minimumOrderAmount: string; startsAt: string; endsAt: string };
const localDateTime = (date: Date) => { const offset = date.getTimezoneOffset() * 60000; return new Date(date.getTime() - offset).toISOString().slice(0, 16); };
const newPromoDraft = (): PromoDraft => { const now = new Date(); const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); return { code: '', discountType: 'FIXED', discountValue: '', minimumOrderAmount: '0', startsAt: localDateTime(now), endsAt: localDateTime(end) }; };

const field = 'w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | number | null>(null);
  const [promoDraft, setPromoDraft] = useState<PromoDraft>(newPromoDraft);
  const [editingPromoId, setEditingPromoId] = useState<number | null>(null);
  const [savingPromo, setSavingPromo] = useState(false);
  const [roleChangeTarget, setRoleChangeTarget] = useState<{ id: number; role: 'CUSTOMER' | 'ADMIN' } | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [changingRoleUserId, setChangingRoleUserId] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [activeSection, setActiveSection] = useState<'users' | 'category' | 'product' | 'promos' | 'orders'>('users');
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    authService.me().then((current) => {
      if (current.role !== 'ADMIN' && current.role !== 'SUPER_ADMIN') { router.replace('/account'); return; }
      setUser(current);
      Promise.all([adminService.categories(), adminService.users(), adminService.promoCodes(), adminService.orders()])
        .then(([loadedCategories, loadedUsers, loadedPromoCodes, loadedOrders]) => {
          setCategories(loadedCategories);
          setUsers(loadedUsers);
          setPromoCodes(loadedPromoCodes);
          setOrders(loadedOrders);
        })
        .catch(() => notify.error('Could not load admin data.'));
    }).catch(() => router.replace('/login'));
  }, [router]);

  async function changeOrderStatus(order: Order, status: OrderStatus) {
    if (status === order.status) return;
    setUpdatingOrderId(order.id);
    try {
      const updated = await adminService.updateOrderStatus(order.id, status);
      setOrders((items) => items.map((item) => item.id === updated.id ? updated : item));
      notify.success(`Order ${order.orderNumber} updated to ${status}.`);
    } catch (reason) { notify.error(reason instanceof Error ? reason.message : 'Could not update order status.'); }
    finally { setUpdatingOrderId(null); }
  }

  async function uploadImage(file?: File) {
    if (!file) return;
    if (!file.type.startsWith('image/')) { notify.error('Please choose an image file.'); return; }
    setUploading(true);
    try {
      const result = await adminService.uploadImage(file);
      setImageUrl(result.url);
      notify.success('Image uploaded. You can now create the product.');
    } catch (reason) { notify.error(reason instanceof Error ? reason.message : 'Image upload failed.'); }
    finally { setUploading(false); }
  }

  async function changeUserRole(userId: number, role: 'CUSTOMER' | 'ADMIN') {
    if (!currentPassword) {
      notify.error('Enter your current password to continue.');
      return;
    }
    setChangingRoleUserId(userId);
    try {
      const updated = await adminService.changeUserRole(userId, role, currentPassword);
      setUsers((items) => items.map((item) => item.id === userId ? updated : item));
      setRoleChangeTarget(null);
      setCurrentPassword('');
      notify.success(`${updated.name} is now ${role === 'ADMIN' ? 'an admin' : 'a customer'}.`);
    } catch (reason) {
      notify.error(reason instanceof Error ? reason.message : 'Could not change user role.');
    } finally {
      setChangingRoleUserId(null);
    }
  }

  async function createCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const category = await adminService.createCategory({ name: String(data.get('name')), slug: String(data.get('slug')), description: String(data.get('description') || '') });
      setCategories((items) => [...items, category]); form.reset(); notify.success('Category created successfully.');
    } catch (reason) { notify.error(reason instanceof Error ? reason.message : 'Could not create category.'); }
  }

  async function savePromoCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingPromo(true);
    const payload = {
      code: promoDraft.code.trim().toUpperCase(),
      discountType: promoDraft.discountType,
      discountValue: Number(promoDraft.discountValue),
      minimumOrderAmount: Number(promoDraft.minimumOrderAmount),
      startsAt: new Date(promoDraft.startsAt).toISOString(),
      endsAt: new Date(promoDraft.endsAt).toISOString(),
    };
    try {
      const saved = editingPromoId === null
        ? await adminService.createPromoCode(payload)
        : await adminService.updatePromoCode(editingPromoId, payload);
      setPromoCodes((items) => editingPromoId === null ? [...items, saved].sort((a, b) => a.code.localeCompare(b.code)) : items.map((item) => item.id === saved.id ? saved : item));
      setPromoDraft(newPromoDraft());
      setEditingPromoId(null);
      notify.success(editingPromoId === null ? 'Promo code created.' : 'Promo code updated.');
    } catch (reason) { notify.error(reason instanceof Error ? reason.message : 'Could not save promo code.'); }
    finally { setSavingPromo(false); }
  }

  function editPromoCode(promo: PromoCode) {
    setEditingPromoId(promo.id);
    setPromoDraft({ code: promo.code, discountType: promo.discountType, discountValue: String(promo.discountValue), minimumOrderAmount: String(promo.minimumOrderAmount), startsAt: localDateTime(new Date(promo.startsAt)), endsAt: localDateTime(new Date(promo.endsAt)) });
  }

  async function deletePromoCode(promo: PromoCode) {
    if (!window.confirm(`Delete promo code ${promo.code}?`)) return;
    try {
      await adminService.deletePromoCode(promo.id);
      setPromoCodes((items) => items.filter((item) => item.id !== promo.id));
      if (editingPromoId === promo.id) { setEditingPromoId(null); setPromoDraft(newPromoDraft()); }
      notify.success(`Promo code ${promo.code} deleted.`);
    } catch (reason) { notify.error(reason instanceof Error ? reason.message : 'Could not delete promo code.'); }
  }

  const updatePromoDraft = (key: keyof PromoDraft, value: string) => setPromoDraft((draft) => ({ ...draft, [key]: value }));

  async function createProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget;
    const data = new FormData(form);
    try {
      await adminService.createProduct({
        slug: String(data.get('slug')), name: String(data.get('name')), brand: String(data.get('brand')), sku: String(data.get('sku')),
        categoryId: Number(data.get('categoryId')), description: String(data.get('description') || ''), shortDescription: String(data.get('shortDescription') || ''),
        price: Number(data.get('price')), originalPrice: Number(data.get('originalPrice') || 0), stockCount: Number(data.get('stockCount')),
        rating: 0, reviewCount: 0, warranty: String(data.get('warranty') || ''),
        images: imageUrl ? [{ url: imageUrl, alt: String(data.get('name')) }] : [], specifications: {}, tags: [],
        featured: data.get('featured') === 'on', bestseller: data.get('bestseller') === 'on', isNew: data.get('isNew') === 'on',
      });
      form.reset(); setImageUrl(''); notify.success('Product created successfully.');
    } catch (reason) { notify.error(reason instanceof Error ? reason.message : 'Could not create product.'); }
  }

  const normalizedUserSearch = userSearch.trim().toLowerCase();
  const filteredUsers = users.filter((account) =>
    [account.name, account.email, account.phone || ''].some((value) => value.toLowerCase().includes(normalizedUserSearch)),
  );

  if (!user) return <div className="container-site py-16 text-gray-600">Loading admin panel...</div>;
  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="container-site">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-blue-700">
              <LayoutDashboard size={17} /> NexusPC administration
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Manage your store</h1>
            <p className="mt-1 text-sm text-gray-500">Manage customers and publish catalog items.</p>
          </div>
          <p className="text-sm text-gray-500">Signed in as <span className="font-medium text-gray-700">{user.email}</span></p>
        </div>

        <div role="tablist" aria-label="Admin sections" className="mb-6 grid grid-cols-1 gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
          <button type="button" role="tab" aria-selected={activeSection === 'users'} aria-controls="admin-users-panel" onClick={() => setActiveSection('users')} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${activeSection === 'users' ? 'bg-blue-50 text-blue-800 ring-1 ring-blue-100' : 'text-gray-600 hover:bg-gray-50'}`}>
            <span className={`rounded-lg p-2 ${activeSection === 'users' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}><Users size={19} /></span>
            <span><span className="block text-sm font-semibold">Manage users</span><span className="block text-xs text-gray-500">Search accounts and roles</span></span>
          </button>
          <button type="button" role="tab" aria-selected={activeSection === 'category'} aria-controls="admin-category-panel" onClick={() => setActiveSection('category')} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${activeSection === 'category' ? 'bg-orange-50 text-orange-800 ring-1 ring-orange-100' : 'text-gray-600 hover:bg-gray-50'}`}>
            <span className={`rounded-lg p-2 ${activeSection === 'category' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}><Tags size={19} /></span>
            <span><span className="block text-sm font-semibold">Add category</span><span className="block text-xs text-gray-500">Organize your catalog</span></span>
          </button>
          <button type="button" role="tab" aria-selected={activeSection === 'product'} aria-controls="admin-product-panel" onClick={() => setActiveSection('product')} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${activeSection === 'product' ? 'bg-blue-50 text-blue-800 ring-1 ring-blue-100' : 'text-gray-600 hover:bg-gray-50'}`}>
            <span className={`rounded-lg p-2 ${activeSection === 'product' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}><PackagePlus size={19} /></span>
            <span><span className="block text-sm font-semibold">Add product</span><span className="block text-xs text-gray-500">Publish an item to your store</span></span>
          </button>
          <button type="button" role="tab" aria-selected={activeSection === 'promos'} aria-controls="admin-promos-panel" onClick={() => setActiveSection('promos')} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${activeSection === 'promos' ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100' : 'text-gray-600 hover:bg-gray-50'}`}>
            <span className={`rounded-lg p-2 ${activeSection === 'promos' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}><Ticket size={19} /></span>
            <span><span className="block text-sm font-semibold">Promo codes</span><span className="block text-xs text-gray-500">Create and manage discounts</span></span>
          </button>
          <button type="button" role="tab" aria-selected={activeSection === 'orders'} aria-controls="admin-orders-panel" onClick={() => setActiveSection('orders')} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${activeSection === 'orders' ? 'bg-indigo-50 text-indigo-800 ring-1 ring-indigo-100' : 'text-gray-600 hover:bg-gray-50'}`}>
            <span className={`rounded-lg p-2 ${activeSection === 'orders' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}><ClipboardList size={19} /></span>
            <span><span className="block text-sm font-semibold">Manage orders</span><span className="block text-xs text-gray-500">Review orders and update status</span></span>
          </button>
        </div>


        {activeSection === 'users' && (
          <section id="admin-users-panel" role="tabpanel" aria-label="Manage users" className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-2 text-purple-600"><ShieldCheck size={20} /></div>
                <div><h2 className="font-bold text-gray-900">Manage users</h2><p className="text-xs text-gray-500">Review accounts and grant admin access</p></div>
              </div>
              <span className="text-sm text-gray-500">{filteredUsers.length} of {users.length} users</span>
            </div>
            <label className="relative mb-5 block max-w-xl">
              <Search size={18} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="search" value={userSearch} onChange={(event) => setUserSearch(event.target.value)} placeholder="Search by name, email, or phone" className={`${field} pl-10`} />
              <span className="sr-only">Search users by name, email, or phone</span>
            </label>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead><tr className="border-b text-xs uppercase tracking-wide text-gray-400"><th className="px-3 py-3">User</th><th className="px-3 py-3">Phone</th><th className="px-3 py-3">Role</th><th className="px-3 py-3 text-right">Action</th></tr></thead>
                <tbody>
                  {filteredUsers.map((account) => <tr key={account.id} className="border-b last:border-0">
                    <td className="px-3 py-4"><p className="font-semibold text-gray-900">{account.name}</p><p className="text-xs text-gray-500">{account.email}</p></td>
                    <td className="px-3 py-4 text-gray-600">{account.phone || '—'}</td>
                    <td className="px-3 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${account.role === 'SUPER_ADMIN' ? 'bg-amber-100 text-amber-800' : account.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>{account.role.replace('_', ' ')}</span></td>
                    <td className="px-3 py-4 text-right">
                      {account.role === 'SUPER_ADMIN' ? <span className="text-xs text-gray-400">Protected account</span> : user.role !== 'SUPER_ADMIN' ? <span className="text-xs text-gray-400">Super admin only</span> : roleChangeTarget?.id === account.id ? <div className="flex items-center justify-end gap-2"><input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} placeholder="Your password" className="w-36 rounded-lg border border-gray-200 px-3 py-2 text-xs" autoFocus /><button type="button" onClick={() => changeUserRole(account.id, roleChangeTarget.role)} disabled={changingRoleUserId === account.id} className="rounded-lg bg-purple-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">{changingRoleUserId === account.id ? 'Checking...' : 'Confirm'}</button><button type="button" onClick={() => { setRoleChangeTarget(null); setCurrentPassword(''); }} className="px-2 text-xs text-gray-500">Cancel</button></div> : <button type="button" onClick={() => { setRoleChangeTarget({ id: account.id, role: account.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN' }); setCurrentPassword(''); }} className="rounded-lg bg-purple-600 px-3 py-2 text-xs font-semibold text-white hover:bg-purple-700">{account.role === 'ADMIN' ? 'Set as customer' : 'Make admin'}</button>}
                    </td>
                  </tr>)}
                </tbody>
              </table>
              {!filteredUsers.length && <p className="py-8 text-center text-sm text-gray-500">{users.length ? 'No users match your search.' : 'No users found.'}</p>}
            </div>
          </section>
        )}

        {activeSection === 'category' && (
          <section id="admin-category-panel" role="tabpanel" aria-label="Add category" className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
            <form onSubmit={createCategory} className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3"><div className="rounded-lg bg-orange-100 p-2 text-orange-600"><Tags size={20} /></div><div><h2 className="font-bold text-gray-900">Add category</h2><p className="text-xs text-gray-500">Organize your catalog</p></div></div>
              <div className="space-y-4"><input name="name" required placeholder="Category name" className={field} /><input name="slug" required pattern="[a-z0-9-]+" placeholder="category-slug" className={field} /><textarea name="description" placeholder="Short description" rows={4} className={field} /><button className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600">Create category</button></div>
            </form>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"><h2 className="mb-4 font-bold text-gray-900">Available categories</h2>{categories.length ? <div className="flex flex-wrap gap-2">{categories.map((category) => <span key={category.id} className="rounded-full bg-blue-50 px-3 py-1.5 text-sm text-blue-700">{category.name}</span>)}</div> : <p className="text-sm text-gray-500">No categories are available yet.</p>}</div>
          </section>
        )}

        {activeSection === 'product' && (
          <section id="admin-product-panel" role="tabpanel" aria-label="Add product">
            <form onSubmit={createProduct} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><PackagePlus size={20} /></div><div><h2 className="font-bold text-gray-900">Add product</h2><p className="text-xs text-gray-500">Publish a new item to your store</p></div></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input name="name" required placeholder="Product name" className={field} /><input name="slug" required pattern="[a-z0-9-]+" placeholder="product-slug" className={field} /><input name="brand" placeholder="Brand" className={field} /><input name="sku" required placeholder="SKU" className={field} />
                <select name="categoryId" required className={field}><option value="">Select category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>
                <input name="price" required type="number" min="0" step="0.01" placeholder="Price (৳)" className={field} /><input name="originalPrice" type="number" min="0" step="0.01" placeholder="Original price (৳)" className={field} /><input name="stockCount" required type="number" min="0" placeholder="Stock count" className={field} /><input name="warranty" placeholder="Warranty" className={field} />
              </div>
              <div className="mt-5 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-5"><div className="flex items-center gap-3"><ImagePlus className="text-blue-600" /><div><p className="font-semibold text-gray-800">Product image</p><p className="text-xs text-gray-500">PNG, JPG or WEBP up to 5MB</p></div></div><label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-blue-700 shadow-sm hover:bg-blue-50"><UploadCloud size={18} />{uploading ? 'Uploading...' : 'Choose image'}<input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => uploadImage(event.target.files?.[0])} /></label>{imageUrl && <p className="mt-3 truncate text-xs text-green-700">Uploaded successfully</p>}</div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2"><textarea name="shortDescription" placeholder="Short description" rows={3} className={field} /><textarea name="description" placeholder="Full description" rows={3} className={field} /></div>
              <div className="mt-5 flex flex-wrap gap-5 text-sm text-gray-600"><label><input name="featured" type="checkbox" className="mr-2" />Featured</label><label><input name="bestseller" type="checkbox" className="mr-2" />Bestseller</label><label><input name="isNew" type="checkbox" className="mr-2" />New product</label></div>
              <button className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700">Create product</button>
            </form>
          </section>
        )}

        {activeSection === 'promos' && (
          <section id="admin-promos-panel" role="tabpanel" aria-label="Manage promo codes" className="grid gap-6 xl:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.2fr)]">
            <form onSubmit={savePromoCode} className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-700"><Ticket size={20} /></div><div><h2 className="font-bold text-gray-900">{editingPromoId === null ? 'Create promo code' : 'Edit promo code'}</h2><p className="text-xs text-gray-500">Set its discount, minimum spend, and validity period.</p></div></div>
                {editingPromoId !== null && <button type="button" onClick={() => { setEditingPromoId(null); setPromoDraft(newPromoDraft()); }} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700" aria-label="Cancel editing"><X size={18} /></button>}
              </div>
              <div className="space-y-4">
                <label className="block space-y-1.5 text-sm font-medium text-gray-700">Promo code<input required minLength={3} maxLength={40} pattern="[A-Za-z0-9_-]+" value={promoDraft.code} onChange={(event) => updatePromoDraft('code', event.target.value)} placeholder="e.g. EID2026" className={field} /></label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block space-y-1.5 text-sm font-medium text-gray-700">Discount type<select value={promoDraft.discountType} onChange={(event) => updatePromoDraft('discountType', event.target.value)} className={field}><option value="FIXED">Fixed amount (৳)</option><option value="PERCENTAGE">Percentage (%)</option></select></label>
                  <label className="block space-y-1.5 text-sm font-medium text-gray-700">Discount value<input required type="number" min="0.01" max={promoDraft.discountType === 'PERCENTAGE' ? 100 : undefined} step="0.01" value={promoDraft.discountValue} onChange={(event) => updatePromoDraft('discountValue', event.target.value)} placeholder={promoDraft.discountType === 'PERCENTAGE' ? '10' : '500'} className={field} /></label>
                </div>
                <label className="block space-y-1.5 text-sm font-medium text-gray-700">Minimum order amount (৳)<input required type="number" min="0" step="0.01" value={promoDraft.minimumOrderAmount} onChange={(event) => updatePromoDraft('minimumOrderAmount', event.target.value)} className={field} /></label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block space-y-1.5 text-sm font-medium text-gray-700">Starts at<input required type="datetime-local" value={promoDraft.startsAt} onChange={(event) => updatePromoDraft('startsAt', event.target.value)} className={field} /></label>
                  <label className="block space-y-1.5 text-sm font-medium text-gray-700">Ends at<input required type="datetime-local" value={promoDraft.endsAt} onChange={(event) => updatePromoDraft('endsAt', event.target.value)} className={field} /></label>
                </div>
                <button disabled={savingPromo} className="w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60">{savingPromo ? 'Saving…' : editingPromoId === null ? 'Create promo code' : 'Save changes'}</button>
              </div>
            </form>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between"><div><h2 className="font-bold text-gray-900">Promo codes</h2><p className="text-xs text-gray-500">{promoCodes.length} code{promoCodes.length === 1 ? '' : 's'} configured</p></div></div>
              {promoCodes.length ? <div className="space-y-3">{promoCodes.map((promo) => {
                const now = Date.now(); const starts = new Date(promo.startsAt).getTime(); const ends = new Date(promo.endsAt).getTime();
                const status = now < starts ? 'Scheduled' : now > ends ? 'Expired' : 'Active';
                const badge = status === 'Active' ? 'bg-green-100 text-green-700' : status === 'Scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600';
                return <article key={promo.id} className="rounded-xl border border-gray-200 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold tracking-wide text-gray-900">{promo.code}</h3><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${badge}`}>{status}</span></div><p className="mt-1 text-sm font-semibold text-emerald-700">{promo.discountType === 'PERCENTAGE' ? `${promo.discountValue}% off` : `৳${promo.discountValue} off`} <span className="font-normal text-gray-500">· minimum spend ৳{promo.minimumOrderAmount}</span></p><p className="mt-2 text-xs text-gray-500">{new Date(promo.startsAt).toLocaleString()} – {new Date(promo.endsAt).toLocaleString()}</p></div>
                    <div className="flex gap-2 self-end sm:self-start"><button type="button" onClick={() => editPromoCode(promo)} className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 hover:text-blue-700" aria-label={`Edit ${promo.code}`}><Pencil size={16} /></button><button type="button" onClick={() => void deletePromoCode(promo)} className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-red-50 hover:text-red-600" aria-label={`Delete ${promo.code}`}><Trash2 size={16} /></button></div>
                  </div>
                </article>;
              })}</div> : <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center text-sm text-gray-500">No promo codes yet. Create one to offer a discount.</div>}
            </div>
          </section>
        )}

        {activeSection === 'orders' && (
          <section id="admin-orders-panel" role="tabpanel" aria-label="Manage orders" className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div><h2 className="font-bold text-gray-900">Manage orders</h2><p className="text-xs text-gray-500">{orders.length} total order{orders.length === 1 ? '' : 's'} · status changes appear in customers’ order history</p></div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <label className="relative block"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input type="search" value={orderSearch} onChange={(event) => setOrderSearch(event.target.value)} placeholder="Search order or customer" className={`${field} pl-9 sm:w-64`}/><span className="sr-only">Search by order number, customer name, or email</span></label>
                <select aria-label="Filter orders by status" value={orderStatusFilter} onChange={(event) => setOrderStatusFilter(event.target.value as 'all' | OrderStatus)} className={`${field} sm:w-44`}><option value="all">All statuses</option>{(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((status) => <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>)}</select>
              </div>
            </div>
            {(() => {
              const query = orderSearch.trim().toLowerCase();
              const visibleOrders = orders.filter((order) => (orderStatusFilter === 'all' || order.status === orderStatusFilter) && [order.orderNumber, order.customerName, order.customerEmail].some((value) => (value || '').toLowerCase().includes(query)));
              return visibleOrders.length ? <div className="space-y-4">{visibleOrders.map((order) => (
                <article key={order.id} className="rounded-xl border border-gray-200 p-4 sm:p-5">
                  <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 md:flex-row md:items-start md:justify-between">
                    <div><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-gray-900">{order.orderNumber}</h3><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold capitalize text-blue-700">{order.paymentMethod} · {order.paymentStatus}</span></div><p className="mt-1 text-sm font-medium text-gray-800">{order.customerName}</p><p className="text-sm text-gray-500">{order.customerEmail} · {order.customerPhone || 'No phone'}</p><p className="mt-1 text-xs text-gray-400">Placed {formatDate(order.createdAt)}</p></div>
                    <label className="block w-full space-y-1 text-xs font-semibold text-gray-500 md:w-48">Order status<select aria-label={`Change status for ${order.orderNumber}`} value={order.status} disabled={updatingOrderId === order.id} onChange={(event) => void changeOrderStatus(order, event.target.value as OrderStatus)} className={`${field} capitalize disabled:opacity-60`}>
                      {(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((status) => <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>)}
                    </select></label>
                  </div>
                  <div className="grid gap-4 py-4 md:grid-cols-[minmax(0,1fr)_240px]">
                    <div><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Items ({order.items.length})</p><ul className="space-y-1.5">{order.items.map((item, index) => <li key={`${item.productId}-${index}`} className="flex justify-between gap-3 text-sm"><span className="text-gray-700">{item.name} <span className="text-gray-400">× {item.quantity}</span></span><span className="shrink-0 font-medium text-gray-700">{formatPrice(item.subtotal)}</span></li>)}</ul><p className="mt-3 text-xs leading-relaxed text-gray-500">Ship to: {order.shippingAddress.address}, {order.shippingAddress.area}, {order.shippingAddress.district}, {order.shippingAddress.division}</p></div>
                    <dl className="space-y-1.5 border-t border-gray-100 pt-3 text-sm md:border-l md:border-t-0 md:pl-4 md:pt-0"><div className="flex justify-between gap-3"><dt className="text-gray-500">Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>{order.discount > 0 && <div className="flex justify-between gap-3 text-green-700"><dt>Discount{order.couponCode ? ` (${order.couponCode})` : ''}</dt><dd>-{formatPrice(order.discount)}</dd></div>}<div className="flex justify-between gap-3"><dt className="text-gray-500">Delivery</dt><dd>{formatPrice(order.deliveryCharge)}</dd></div><div className="flex justify-between gap-3 border-t border-gray-100 pt-2 font-bold text-gray-900"><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div></dl>
                  </div>
                </article>
              ))}</div> : <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center text-sm text-gray-500">{orders.length ? 'No orders match those filters.' : 'No customer orders yet.'}</div>;
            })()}
          </section>
        )}
      </div>
    </main>
  );
}
