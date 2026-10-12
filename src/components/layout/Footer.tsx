// src/components/layout/Footer.tsx
import Link from 'next/link';
import { MapPin, Phone, Mail, Cpu } from 'lucide-react';
import NewsletterForm from './NewsletterForm';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[var(--header-bg)] pt-12 text-slate-300 sm:pt-14 lg:pt-16">
      <div className="container-site">
        <div className="mb-10 grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2 lg:mb-12 lg:grid-cols-[1.2fr_0.8fr_1fr] lg:gap-x-14">
          
          {/* Company Info */}
          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <Link href="/" className="mb-5 flex w-fit items-center gap-2">
              <div className="bg-blue-600 text-white p-1.5 rounded flex items-center justify-center">
                <Cpu size={24} />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">Nexus<span className="text-blue-500">PC</span></span>
            </Link>
            
            <p className="max-w-md text-sm leading-6 text-slate-400">
              Find the right parts for your next build. NexusPC brings trusted PC components, clear product details, and helpful service to builders across Bangladesh.
            </p>

            <div className="space-y-3 border-t border-slate-800 pt-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Online store only — no physical shop yet.</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-blue-500 flex-shrink-0" />
                <a href="tel:01828370410" className="text-sm transition-colors hover:text-blue-400">01828370410</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-blue-500 flex-shrink-0" />
                <span className="text-sm">info@nexuspc.com.bd</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-5 text-sm font-bold tracking-[0.12em] text-white uppercase">Shop Categories</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
              {[
                ['Processor', 'cpu'], ['Graphics Card', 'gpu'], ['Motherboard', 'motherboard'], ['RAM', 'ram'],
                ['Storage', 'storage'], ['Monitor', 'monitor'], ['Keyboard', 'keyboard'], ['Mouse', 'mouse'],
              ].map(([item, slug]) => (
                <li key={item}>
                  <Link href={`/products/${slug}`} className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-blue-400">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-700"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Socials */}
          <div className="space-y-6 border-t border-slate-800 pt-6 md:border-t-0 md:pt-0">
            <div>
              <h3 className="mb-3 text-sm font-bold tracking-[0.12em] text-white uppercase">Stay Updated</h3>
              <p className="mb-4 max-w-sm text-sm leading-6 text-slate-400">Get product updates and special offers straight to your inbox.</p>
              <NewsletterForm />
            </div>

            <div className="border-t border-slate-800 pt-5">
              <h3 className="mb-4 text-xs font-bold tracking-[0.12em] text-white uppercase">Follow Us</h3>
              <div className="flex flex-wrap gap-3">
                <span aria-label="Facebook link coming soon" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </span>
                <span aria-label="Twitter link coming soon" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                </span>
                <span aria-label="Instagram link coming soon" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </span>
                <span aria-label="YouTube link coming soon" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col items-center justify-between gap-5 border-t border-slate-800 py-6 md:flex-row md:items-center">
          <p className="text-center text-xs leading-5 text-slate-500 md:text-left sm:text-sm">
            &copy; {new Date().getFullYear()} NexusPC. All rights reserved. Built as a university project by{' '}
            <a href="https://sarawer.me" target="_blank" rel="noreferrer" className="text-slate-300 transition-colors hover:text-blue-400">Sarawer</a>.
          </p>
          <div className="flex flex-wrap justify-center gap-2 md:justify-end">
             <div className="flex h-8 items-center justify-center rounded-md border border-slate-700 bg-slate-800/70 px-3 text-[11px] font-semibold text-slate-400">Pay on delivery</div>
             <div className="flex h-8 items-center justify-center rounded-md border border-slate-700 bg-slate-800/70 px-3 text-[11px] font-semibold text-slate-400">Online payments soon</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
