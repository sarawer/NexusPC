'use client';
import { useEffect, useState, useRef } from 'react';
import { useIsClient } from '@/lib/authState';

const PALETTES = [
  { id: 'original', label: 'Original (Blue)' },
  { id: 'emerald', label: 'Emerald' },
  { id: 'crimson', label: 'Crimson' },
  { id: 'copper', label: 'Copper' },
  { id: 'violet', label: 'Violet' },
  { id: 'graphite', label: 'Graphite' },
];

export default function PaletteSwitcher() {
  const mounted = useIsClient();
  const [palette, setPalette] = useState(() => typeof window === 'undefined' ? 'original' : localStorage.getItem('nexus_palette') || 'original');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (palette === 'original') document.documentElement.removeAttribute('data-palette');
    else document.documentElement.setAttribute('data-palette', palette);
  }, [palette]);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [open]);

  const changePalette = (p: string) => {
    setPalette(p);
    localStorage.setItem('nexus_palette', p);
    if (p === 'original') {
      document.documentElement.removeAttribute('data-palette');
    } else {
      document.documentElement.setAttribute('data-palette', p);
    }
    setOpen(false);
  };

  if (!mounted) return null;
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-2">
      {open && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden w-48">
          <div className="px-3 py-2 text-slate-400 text-[10px] uppercase tracking-widest font-bold border-b border-slate-700">
            Palette
          </div>
          {PALETTES.map(p => (
            <button
              key={p.id}
              onClick={() => changePalette(p.id)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                palette === p.id
                  ? 'bg-slate-700 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {palette === p.id && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
              {palette !== p.id && <span className="w-1.5 h-1.5 rounded-full bg-transparent" />}
              {p.label}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-label="Toggle palette switcher"
        className="bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 select-none"
      >
        <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
        Palette
      </button>
    </div>
  );
}
