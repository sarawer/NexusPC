// src/components/home/HeroBanner.tsx
import Link from 'next/link';
import { Zap, Shield, Truck } from 'lucide-react';
import FeaturedBuild from './FeaturedBuild';
import { Chakra_Petch } from 'next/font/google';

const chakra = Chakra_Petch({ weight: ['700'], subsets: ['latin'] });

export default function HeroBanner() {
  return (
    <div className="w-full bg-[var(--header-bg)] relative overflow-hidden">
      {/* Background glow effect - single soft radial highlight behind the panel */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-blue-500/15 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Subtle grid texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      
      <div className="container-site relative z-10 py-12 md:py-20 lg:py-24 flex flex-col md:flex-row items-center gap-10">
        
        {/* Text Content */}
        <div className="w-full md:w-1/2 flex flex-col items-start gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-300 text-sm font-medium backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            New Arrivals: RTX 40 Super Series
          </div>
          
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight ${chakra.className}`}>
            BUILD YOUR ULTIMATE <br />
            GAMING RIG TODAY
          </h1>
          {/* Alternative option: "NATIONWIDE DELIVERY ON ALL CUSTOM PC BUILDS" */}
          
          <p className="text-lg text-slate-300 max-w-[560px] leading-relaxed">
            Configure your dream PC with the latest components. Enjoy official warranty and fast delivery across Bangladesh.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2">
            <Link href="/products" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-8 rounded-lg transition-colors text-center focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[var(--header-bg)]">
              Shop Now
            </Link>
            <Link href="/pc-builder" className="bg-transparent border border-slate-600 hover:border-slate-400 text-white font-semibold py-3.5 px-8 rounded-lg transition-colors text-center focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-[var(--header-bg)]">
              PC Builder
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-white/10 w-full">
             <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
               <Truck size={18} className="text-orange-500" /> Fast Delivery
             </div>
             <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
               <Shield size={18} className="text-orange-500" /> Official Warranty
             </div>
             <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
               <Zap size={18} className="text-orange-500" /> EMI Available
             </div>
          </div>
        </div>

        {/* Featured Build Panel */}
        <div className="w-full md:w-1/2 relative mt-8 md:mt-0">
           <FeaturedBuild />
        </div>
        
      </div>
    </div>
  );
}
