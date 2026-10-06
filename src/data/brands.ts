// src/data/brands.ts
import type { Brand } from '@/types/product';

export const brands: Brand[] = [
  { id: 'brand-01', slug: 'asus', name: 'ASUS', country: 'Taiwan', productCount: 87 },
  { id: 'brand-02', slug: 'msi', name: 'MSI', country: 'Taiwan', productCount: 73 },
  { id: 'brand-03', slug: 'gigabyte', name: 'Gigabyte', country: 'Taiwan', productCount: 69 },
  { id: 'brand-04', slug: 'intel', name: 'Intel', country: 'USA', productCount: 32 },
  { id: 'brand-05', slug: 'amd', name: 'AMD', country: 'USA', productCount: 28 },
  { id: 'brand-06', slug: 'corsair', name: 'Corsair', country: 'USA', productCount: 61 },
  { id: 'brand-07', slug: 'kingston', name: 'Kingston', country: 'USA', productCount: 44 },
  { id: 'brand-08', slug: 'seagate', name: 'Seagate', country: 'USA', productCount: 29 },
  { id: 'brand-09', slug: 'western-digital', name: 'Western Digital', country: 'USA', productCount: 31 },
  { id: 'brand-10', slug: 'deepcool', name: 'DeepCool', country: 'China', productCount: 38 },
  { id: 'brand-11', slug: 'nzxt', name: 'NZXT', country: 'USA', productCount: 25 },
  { id: 'brand-12', slug: 'cooler-master', name: 'Cooler Master', country: 'Taiwan', productCount: 52 },
  { id: 'brand-13', slug: 'logitech', name: 'Logitech', country: 'Switzerland', productCount: 48 },
  { id: 'brand-14', slug: 'steelseries', name: 'SteelSeries', country: 'Denmark', productCount: 33 },
  { id: 'brand-15', slug: 'zotac', name: 'ZOTAC', country: 'Hong Kong', productCount: 21 },
];

export const getBrandBySlug = (slug: string): Brand | undefined =>
  brands.find((b) => b.slug === slug);
