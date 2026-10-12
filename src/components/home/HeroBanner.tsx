import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Cpu, ShieldCheck, Truck, Zap } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section className="bg-slate-100 py-6 sm:py-8 lg:py-10" aria-label="NexusPC featured offer">
      <div className="container-site">
        <div className="relative isolate min-h-[410px] overflow-hidden rounded-2xl bg-slate-950 text-white shadow-xl sm:min-h-[390px] lg:min-h-[430px]">
          <div aria-hidden="true" className="hero-banner-photo absolute inset-0 -z-20 md:inset-y-0 md:left-auto md:right-0 md:w-[56%]">
            <Image
              src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1400&h=800&q=90"
              alt="Gaming PC with blue RGB lighting"
              fill
              preload
              quality={75}
              sizes="(max-width: 767px) 100vw, 56vw"
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/10" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/10" />

          <div className="flex min-h-[410px] flex-col justify-center px-6 py-12 sm:min-h-[390px] sm:px-12 lg:min-h-[430px] lg:px-16">
            <div className="max-w-2xl pr-12 sm:pr-0 md:max-w-[48%] lg:max-w-[50%]">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-[10px] font-bold tracking-[0.19em] text-blue-100 backdrop-blur sm:text-xs">
                <Cpu size={15} className="text-blue-300" /> MADE FOR YOUR NEXT WIN
              </div>
              <h1 className="max-w-xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]" style={{ color: '#fff' }}>
                Build your ultimate gaming setup
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-6 text-slate-200 sm:text-base sm:leading-7">
                Explore powerful PC components and find the right combination for the way you play.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link href="/products" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/30 transition-colors hover:bg-blue-500">
                  Shop components <ArrowRight size={17} />
                </Link>
                <Link href="/best-builds" className="rounded-lg border border-white/30 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15">
                  See Best Builds
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 divide-y divide-slate-100 rounded-xl bg-white px-4 py-1 text-xs font-semibold text-slate-600 shadow-sm sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:text-sm">
          <span className="flex items-center justify-center gap-2 py-3"><Truck size={17} className="shrink-0 text-blue-600" /> Delivery across Bangladesh</span>
          <span className="flex items-center justify-center gap-2 py-3"><ShieldCheck size={17} className="shrink-0 text-blue-600" /> Official warranty options</span>
          <span className="flex items-center justify-center gap-2 py-3"><Zap size={17} className="shrink-0 text-blue-600" /> Build your PC your way</span>
        </div>
      </div>
    </section>
  );
}
