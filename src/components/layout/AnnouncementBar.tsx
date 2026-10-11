'use client';
// src/components/layout/AnnouncementBar.tsx
import { X, Truck, Tag } from 'lucide-react';
import { useState } from 'react';

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-[var(--announcement-bg)] text-white text-xs py-2 px-4 relative">
      <div className="container-site flex items-center justify-center gap-6 flex-wrap">
        <span className="flex items-center gap-1.5">
          <Truck size={13} className="opacity-80" />
          Free delivery inside Dhaka on orders over ৳5,000
        </span>
        <span className="hidden sm:block text-white/30">|</span>
        <span className="flex items-center gap-1.5">
          <Tag size={13} className="opacity-80" />
          Check out current offers and apply your promo code at checkout
        </span>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
        aria-label="Close announcement"
      >
        <X size={14} />
      </button>
    </div>
  );
}
