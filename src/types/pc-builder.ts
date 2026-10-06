// src/types/pc-builder.ts
import type { ProductSpecification } from './product';

export interface PCBuildComponent {
  id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  slug: string;
  specifications: ProductSpecification[];
}

export interface PCBuildSlot {
  key: string;
  label: string;
  required: boolean;
  categorySlug: string;
  icon: string;
  selectedComponent?: PCBuildComponent;
}

export interface CompatibilityWarning {
  severity: 'error' | 'warning';
  message: string;
  affectedSlots: string[];
}

export interface PCBuild {
  id?: string;
  name: string;
  slots: PCBuildSlot[];
  totalPrice: number;
  warnings: CompatibilityWarning[];
  createdAt?: string;
}
