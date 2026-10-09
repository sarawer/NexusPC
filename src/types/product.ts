// src/types/product.ts
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  categorySlug: string;
  categoryName: string;
  sku: string;
  description: string;
  shortDescription: string;
  images: ProductImage[];
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  stockStatus: StockStatus;
  stockCount: number;
  rating: number;
  reviewCount: number;
  warranty: string;
  specifications: ProductSpecification[];
  tags: string[];
  isFeatured: boolean;
  isBestseller: boolean;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  productCount: number;
  image?: string;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  logo?: string;
  country: string;
  productCount: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  createdAt: string;
  helpful: number;
}

export interface ProductFilters {
  query?: string;
  categorySlug?: string;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  stockStatus?: StockStatus[];
  minRating?: number;
  isNew?: boolean;
}

export type SortOption =
  | 'featured'
  | 'price_asc'
  | 'price_desc'
  | 'rating'
  | 'newest'
  | 'name_asc';
