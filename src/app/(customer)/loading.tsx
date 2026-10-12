export default function CustomerLoading() {
  return (
    <div role="status" aria-label="Loading page" className="min-h-[55vh] bg-slate-50 py-8">
      <span className="sr-only">Loading page…</span>
      <div className="container-site animate-pulse space-y-6">
        <div className="h-8 w-56 rounded bg-slate-200" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => <div key={index} className="aspect-[0.78] rounded-xl border border-slate-100 bg-white" />)}
        </div>
      </div>
    </div>
  );
}
