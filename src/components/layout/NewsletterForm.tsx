'use client';

export default function NewsletterForm() {
  return (
    <form className="flex" onSubmit={(e) => e.preventDefault()}>
      <input 
        type="email" 
        placeholder="Enter your email" 
        className="bg-slate-800 border-none text-sm px-4 py-2.5 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder-slate-500"
      />
      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-r-md text-sm font-semibold transition-colors">
        Subscribe
      </button>
    </form>
  );
}
