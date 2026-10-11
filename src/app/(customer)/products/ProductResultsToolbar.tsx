'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type Props = { title: string; count: number; sort: string; page: number; pageSize?: number };

export default function ProductResultsToolbar({ title, count, sort, page, pageSize = 12 }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageCount = Math.max(1, Math.ceil(count / pageSize));

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== 'page') params.delete('page');
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <>
      <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4 sm:flex-row">
        <h1 className="text-xl font-bold text-gray-900">{title} <span className="ml-2 text-sm font-normal text-gray-500">({count} items)</span></h1>
        <label className="flex w-full items-center gap-2 text-sm font-medium text-gray-500 sm:w-auto">
          Sort By:
          <select aria-label="Sort products" className="input-base min-w-[170px] cursor-pointer bg-gray-50 px-3 py-1.5 text-sm" value={sort} onChange={(event) => update('sort', event.target.value)}>
            <option value="featured">Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
            <option value="rating">Top Rated</option>
            <option value="name_asc">Name: A to Z</option>
          </select>
        </label>
      </div>
      {count > pageSize && (
        <nav aria-label="Product pages" className="mt-8 flex justify-center gap-2">
          <button type="button" onClick={() => update('page', String(page - 1))} disabled={page <= 0} className="rounded-md border border-gray-200 px-3 py-2 text-sm disabled:opacity-40">Previous</button>
          <span className="px-2 py-2 text-sm text-gray-600">Page {page + 1} of {pageCount}</span>
          <button type="button" onClick={() => update('page', String(page + 1))} disabled={page >= pageCount - 1} className="rounded-md border border-gray-200 px-3 py-2 text-sm disabled:opacity-40">Next</button>
        </nav>
      )}
    </>
  );
}
