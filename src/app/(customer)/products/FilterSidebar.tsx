'use client';
// src/app/(customer)/products/FilterSidebar.tsx
import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';

// Mock filter data - in reality, this would come from the API based on current category
const BRANDS = ['Intel', 'AMD', 'ASUS', 'Gigabyte', 'MSI', 'Corsair', 'Samsung', 'DeepCool'];
const STOCK_STATUSES = [
  { id: 'in_stock', label: 'In Stock' },
  { id: 'low_stock', label: 'Low Stock' }
];

function FilterContent({ priceRange, setPriceRange }: { priceRange: number[]; setPriceRange: (val: number[]) => void }) {
  return (
    <div className="space-y-8">
      {/* Price Filter */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Price Range</h3>
        <div className="px-2 mb-6">
          <Slider
            defaultValue={[0, 200000]}
            max={500000}
            step={1000}
            value={priceRange}
            onValueChange={(val) => setPriceRange(Array.isArray(val) ? val as number[] : [val as number])}
            className="mb-4"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <span className="text-xs text-gray-500 mb-1 block">Min (৳)</span>
            <input 
              type="number" 
              value={priceRange[0]} 
              onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
              className="input-base py-1.5 px-2 text-sm"
            />
          </div>
          <div className="flex-1">
            <span className="text-xs text-gray-500 mb-1 block">Max (৳)</span>
            <input 
              type="number" 
              value={priceRange[1]} 
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 200000])}
              className="input-base py-1.5 px-2 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Brands Filter */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Brands</h3>
        <div className="space-y-3 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
          {BRANDS.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox id={`brand-${brand}`} />
              <Label htmlFor={`brand-${brand}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 cursor-pointer">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Availability</h3>
        <div className="space-y-3">
          {STOCK_STATUSES.map((status) => (
            <div key={status.id} className="flex items-center space-x-2">
              <Checkbox id={`status-${status.id}`} />
              <Label htmlFor={`status-${status.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 cursor-pointer">
                {status.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <Button className="w-full bg-blue-600 hover:bg-blue-700 font-bold">Apply Filters</Button>
    </div>
  );
}

export default function FilterSidebar() {
  const [priceRange, setPriceRange] = useState([0, 200000]);

  return (
    <>
      {/* Mobile Trigger */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger render={
            <Button variant="outline" className="w-full flex items-center gap-2 bg-white font-medium border-gray-200" />
          }>
              <SlidersHorizontal size={16} />
              Filters
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 border-r border-gray-200">
            <SheetHeader className="p-4 border-b border-gray-100 text-left">
              <SheetTitle className="flex items-center gap-2">
                <SlidersHorizontal size={18} />
                Filters
              </SheetTitle>
            </SheetHeader>
            <div className="p-4 overflow-y-auto h-[calc(100vh-65px)]">
              <FilterContent priceRange={priceRange} setPriceRange={setPriceRange} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-[280px] flex-shrink-0">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
          <div className="flex items-center gap-2 mb-6 text-gray-900">
            <SlidersHorizontal size={20} />
            <h2 className="text-lg font-bold">Filters</h2>
          </div>
          <FilterContent priceRange={priceRange} setPriceRange={setPriceRange} />
        </div>
      </div>
    </>
  );
}
