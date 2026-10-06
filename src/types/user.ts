// src/types/user.ts
export type UserRole = 'customer' | 'admin';

export interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  division: string;
  district: string;
  area: string;
  address: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  addresses: Address[];
  createdAt: string;
}
