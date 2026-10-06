import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as BDT currency
 */
export function formatPrice(amount: number): string {
  return `৳${amount.toLocaleString('en-BD')}`;
}

/**
 * Calculate the discount percentage between original and current price
 */
export function calculateDiscount(originalPrice: number, currentPrice: number): number {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

/**
 * Truncate text to a given length
 */
export function truncate(text: string, length: number): string {
  return text.length > length ? text.slice(0, length) + '…' : text;
}

/**
 * Format a date string to a human-readable format
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get delivery charge based on method
 */
export function getDeliveryCharge(method: 'inside_dhaka' | 'outside_dhaka'): number {
  return method === 'inside_dhaka' ? 80 : 150;
}
