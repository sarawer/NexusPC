// src/components/layout/Footer.tsx
import Link from 'next/link';
import { MapPin, Phone, Mail, Cpu } from 'lucide-react';
import NewsletterForm from './NewsletterForm';

export default function Footer() {
  return (
    <footer className="bg-[var(--header-bg)] text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="container-site">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
          
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="bg-blue-600 text-white p-1.5 rounded flex items-center justify-center">
                <Cpu size={24} />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">Nexus<span className="text-blue-500">PC</span></span>
            </Link>
            
            <p className="text-sm leading-relaxed text-slate-400">
              Find the right parts for your next build. NexusPC brings trusted PC components, clear product details, and helpful service to builders across Bangladesh.
            </p>

            <div className="space-y-3 pt-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">1st Floor, Tech Tower, Begum Rokeya Sharani, Mirpur 10, Dhaka 1216</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-blue-500 flex-shrink-0" />
                <span className="text-sm">+88 09611-901442</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-blue-500 flex-shrink-0" />
                <span className="text-sm">info@nexuspc.com.bd</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg tracking-wide uppercase">Categories</h3>
            <ul className="space-y-3">
              {[
                ['Processor', 'cpu'], ['Graphics Card', 'gpu'], ['Motherboard', 'motherboard'], ['RAM', 'ram'],
                ['Storage', 'storage'], ['Monitor', 'monitor'], ['Keyboard', 'keyboard'], ['Mouse', 'mouse'],
              ].map(([item, slug]) => (
                <li key={item}>
                  <Link href={`/products/${slug}`} className="text-sm hover:text-blue-400 transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Socials */}
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-bold mb-4 text-lg tracking-wide uppercase">Stay Updated</h3>
              <p className="text-sm text-slate-400 mb-4">Get updates about products and offers when our newsletter launches.</p>
              <NewsletterForm />
            </div>

            <div className="pt-4 border-t border-slate-800">
              <h3 className="text-white font-bold mb-4 text-sm tracking-wide uppercase">Follow Us</h3>
              <div className="flex gap-4">
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
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} NexusPC. All rights reserved. Built as a university project by{' '}
            <a href="https://sarawer.me" target="_blank" rel="noreferrer" className="text-slate-300 transition-colors hover:text-blue-400">Sarawer</a>.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
             <div className="h-8 px-2 bg-slate-800 rounded flex items-center justify-center text-xs font-bold text-slate-400">Pay on delivery</div>
             <div className="h-8 px-2 bg-slate-800 rounded flex items-center justify-center text-xs font-bold text-slate-400">Online payments soon</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
