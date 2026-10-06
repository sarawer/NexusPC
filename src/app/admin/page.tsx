'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ImagePlus, LayoutDashboard, PackagePlus, Tags, UploadCloud } from 'lucide-react';
import { adminService, type Category } from '@/lib/services/adminService';
import { authService, type User } from '@/lib/services/authService';

const field = 'w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    authService.me().then((current) => {
      if (current.role !== 'ADMIN') { router.replace('/account'); return; }
      setUser(current);
      adminService.categories().then(setCategories).catch(() => setError('Could not load categories.'));
    }).catch(() => router.replace('/login'));
  }, [router]);

  async function uploadImage(file?: File) {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please choose an image file.'); return; }
    setUploading(true); setError('');
    try {
      const result = await adminService.uploadImage(file);
      setImageUrl(result.url);
      setMessage('Image uploaded. You can now create the product.');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Image upload failed.'); }
    finally { setUploading(false); }
  }

  async function createCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; setMessage(''); setError('');
    const data = new FormData(form);
    try {
      const category = await adminService.createCategory({ name: String(data.get('name')), slug: String(data.get('slug')), description: String(data.get('description') || '') });
      setCategories((items) => [...items, category]); form.reset(); setMessage('Category created successfully.');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not create category.'); }
  }

  async function createProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; setMessage(''); setError('');
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
      form.reset(); setImageUrl(''); setMessage('Product created successfully.');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not create product.'); }
  }

  if (!user) return <main className="container-site py-16">Loading admin panel...</main>;
  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="container-site">
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700 p-8 text-white shadow-lg">
          <div className="flex items-center gap-3 text-blue-200 text-sm font-medium mb-3"><LayoutDashboard size={18} /> NEXUSPC ADMINISTRATION</div>
          <h1 className="text-3xl font-extrabold">Manage your store</h1>
          <p className="mt-2 text-blue-100">Create categories and publish products from one place.</p>
          <p className="mt-4 text-sm text-blue-200">Signed in as {user.email}</p>
        </div>
        {(message || error) && <div className={`mb-6 flex items-center gap-2 rounded-xl p-4 text-sm ${error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}><CheckCircle2 size={18} />{error || message}</div>}
        <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
          <form onSubmit={createCategory} className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3"><div className="rounded-lg bg-orange-100 p-2 text-orange-600"><Tags size={20} /></div><div><h2 className="font-bold text-gray-900">Add category</h2><p className="text-xs text-gray-500">Organize your catalog</p></div></div>
            <div className="space-y-4"><input name="name" required placeholder="Category name" className={field} /><input name="slug" required pattern="[a-z0-9-]+" placeholder="category-slug" className={field} /><textarea name="description" placeholder="Short description" rows={4} className={field} /><button className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600">Create category</button></div>
            <div className="mt-6 border-t pt-5"><p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Available categories</p><div className="flex flex-wrap gap-2">{categories.map((category) => <span key={category.id} className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">{category.name}</span>)}</div></div>
          </form>
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
        </div>
      </div>
    </main>
  );
}
