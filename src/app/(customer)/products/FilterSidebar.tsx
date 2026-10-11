'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const BRANDS = ['Intel', 'AMD', 'ASUS', 'Gigabyte', 'MSI', 'Corsair', 'Samsung', 'DeepCool'];
const STOCK_STATUSES = [
  { id: 'in_stock', label: 'In Stock' },
  { id: 'low_stock', label: 'Low Stock' },
  { id: 'out_of_stock', label: 'Out of Stock' },
];

function FilterContent({
  priceRange, setPriceRange, brands, setBrands, stock, setStock, apply,
}: {
  priceRange: number[]; setPriceRange: (value: number[]) => void;
  brands: string[]; setBrands: (value: string[]) => void;
  stock: string[]; setStock: (value: string[]) => void;
  apply: () => void;
}) {
  const toggle = (values: string[], value: string, checked: boolean | 'indeterminate', setter: (next: string[]) => void) => {
    setter(checked ? [...values.filter((item) => item !== value), value] : values.filter((item) => item !== value));
  };
  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 border-b border-gray-100 pb-2 font-bold text-gray-900">Price Range</h3>
        <div className="mb-6 px-2">
          <Slider min={0} max={2000000} step={5000} defaultValue={[0, 2000000]} value={priceRange} onValueChange={(value) => setPriceRange(Array.isArray(value) ? value as number[] : [value as number])} className="mb-4" />
        </div>
        <div className="flex items-center gap-4">
          <label className="flex-1 text-xs text-gray-500">Min (৳)<input type="number" min={0} value={priceRange[0]} onChange={(event) => setPriceRange([Number(event.target.value) || 0, priceRange[1]])} className="input-base mt-1 py-1.5 px-2 text-sm" /></label>
          <label className="flex-1 text-xs text-gray-500">Max (৳)<input type="number" min={0} value={priceRange[1]} onChange={(event) => setPriceRange([priceRange[0], Number(event.target.value) || 2000000])} className="input-base mt-1 py-1.5 px-2 text-sm" /></label>
        </div>
      </div>
      <div>
        <h3 className="mb-4 border-b border-gray-100 pb-2 font-bold text-gray-900">Brands</h3>
        <div className="max-h-48 space-y-3 overflow-y-auto pr-2">
          {BRANDS.map((brand) => <label key={brand} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"><Checkbox checked={brands.includes(brand)} onCheckedChange={(checked) => toggle(brands, brand, checked, setBrands)} />{brand}</label>)}
        </div>
      </div>
      <div>
        <h3 className="mb-4 border-b border-gray-100 pb-2 font-bold text-gray-900">Availability</h3>
        <div className="space-y-3">
          {STOCK_STATUSES.map((status) => <label key={status.id} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"><Checkbox checked={stock.includes(status.id)} onCheckedChange={(checked) => toggle(stock, status.id, checked, setStock)} />{status.label}</label>)}
        </div>
      </div>
      <Button type="button" onClick={apply} className="w-full bg-blue-600 font-bold hover:bg-blue-700">Apply Filters</Button>
    </div>
  );
}

export default function FilterSidebar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [priceRange, setPriceRange] = useState([Number(searchParams.get('minPrice')) || 0, Number(searchParams.get('maxPrice')) || 2000000]);
  const [brands, setBrands] = useState(searchParams.get('brands')?.split(',').filter(Boolean) || []);
  const [stock, setStock] = useState(searchParams.get('stockStatus')?.split(',').filter(Boolean) || []);

  const apply = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (priceRange[0] > 0) params.set('minPrice', String(priceRange[0])); else params.delete('minPrice');
    if (priceRange[1] < 2000000) params.set('maxPrice', String(priceRange[1])); else params.delete('maxPrice');
    if (brands.length) params.set('brands', brands.join(',')); else params.delete('brands');
    if (stock.length) params.set('stockStatus', stock.join(',')); else params.delete('stockStatus');
    params.delete('page');
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };
  const contentProps = { priceRange, setPriceRange, brands, setBrands, stock, setStock, apply };

  return <>
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger render={<Button variant="outline" className="w-full items-center gap-2 border-gray-200 bg-white font-medium" />}><SlidersHorizontal size={16} />Filters</SheetTrigger>
        <SheetContent side="left" className="w-[300px] border-r border-gray-200 p-0 sm:w-[350px]">
          <SheetHeader className="border-b border-gray-100 p-4 text-left"><SheetTitle className="flex items-center gap-2"><SlidersHorizontal size={18} />Filters</SheetTitle></SheetHeader>
          <div className="h-[calc(100vh-65px)] overflow-y-auto p-4"><FilterContent {...contentProps} /></div>
        </SheetContent>
      </Sheet>
    </div>
    <aside className="sticky top-24 hidden w-[280px] shrink-0 self-start rounded-xl border border-gray-100 bg-white p-6 shadow-sm md:block">
      <div className="mb-6 flex items-center gap-2 text-gray-900"><SlidersHorizontal size={20} /><h2 className="text-lg font-bold">Filters</h2></div>
      <FilterContent {...contentProps} />
    </aside>
  </>;
}
