// src/types/order.ts
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'card' | 'bank_transfer';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type DeliveryMethod = 'inside_dhaka' | 'outside_dhaka';

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  division: string;
  district: string;
  area: string;
  address: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  deliveryMethod: DeliveryMethod;
  deliveryCharge: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
  notes?: string;
  paymentUrl?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
}
