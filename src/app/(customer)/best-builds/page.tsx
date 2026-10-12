const builds = [
  { name: 'Arctic White Creator', type: 'CREATOR WORKSTATION', price: '৳2,45,000', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=85', specs: 'Ryzen 9 · RTX 4070 · 32GB DDR5' },
  { name: 'Midnight Gaming Rig', type: '4K GAMING', price: '৳3,20,000', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=85', specs: 'Core i7 · RTX 4080 · 32GB DDR5' },
  { name: 'Neon Compact', type: 'COMPACT GAMING', price: '৳1,68,000', image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=85', specs: 'Ryzen 7 · RTX 4060 · 16GB DDR5' },
  { name: 'Studio Pro', type: 'PROFESSIONAL', price: '৳2,85,000', image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1200&q=85', specs: 'Core i9 · RTX 4070 Ti · 64GB DDR5' },
  { name: 'Obsidian RGB', type: 'HIGH PERFORMANCE', price: '৳1,95,000', image: 'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?auto=format&fit=crop&w=1200&q=85', specs: 'Ryzen 7 · RTX 4070 · 32GB DDR5' },
  { name: 'Aurora White', type: 'POPULAR BUILD', price: '৳1,42,000', image: 'https://images.unsplash.com/photo-1587202372583-49330a15584d?auto=format&fit=crop&w=1200&q=85', specs: 'Core i5 · RTX 4060 · 16GB DDR5' },
  { name: 'Starter Gaming PC', type: '1080P GAMING', price: '৳98,000', image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=85', specs: 'Ryzen 5 · Radeon RX 6600 · 16GB DDR4' },
  { name: 'Everyday Workstation', type: 'STUDY & OFFICE', price: '৳78,000', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=85', specs: 'Core i5 · Integrated Graphics · 16GB DDR5' },
  { name: 'Creator Studio Plus', type: 'CONTENT CREATION', price: '৳1,75,000', image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1200&q=85', specs: 'Ryzen 7 · RTX 4060 Ti · 32GB DDR5' },
];

export default function BestBuildsPage() {
  return (
    <div className="min-h-screen bg-[#090b10] text-white">
      <section className="mx-auto max-w-7xl px-5 pb-12 pt-14 text-center sm:px-8">
        <p className="mb-3 text-xs font-bold tracking-[0.28em] text-blue-400">NEXUSPC CURATED SYSTEMS</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl" style={{ color: '#f8fafc' }}>BEST PC BUILDS 2026</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">Explore hand-picked PC setups for gaming, creating, studying, and everyday performance.</p>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-5 pb-16 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
        {builds.map((build, index) => (
          <article key={build.name} className={`group overflow-hidden rounded-2xl border border-white/10 bg-[#111722] ${index === 0 ? 'lg:col-span-2' : ''}`}>
            <div className={`relative overflow-hidden ${index === 0 ? 'h-72 sm:h-96' : 'h-64'}`}>
              <div role="img" aria-label={`${build.name} PC setup`} className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `linear-gradient(180deg, transparent 45%, rgba(0,0,0,.72)), url("${build.image}")` }} />
              <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-bold tracking-[0.18em] text-white backdrop-blur">{build.type}</span>
              <span className="absolute bottom-5 right-5 text-lg font-bold">{build.price}</span>
            </div>
            <div className="p-5">
              <h2 className="text-lg font-bold text-white" style={{ color: '#f8fafc' }}>{build.name}</h2>
              <p className="mt-1 text-sm text-slate-300" style={{ color: '#cbd5e1' }}>{build.specs}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
