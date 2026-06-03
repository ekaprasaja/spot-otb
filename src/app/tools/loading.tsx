import { Skeleton } from "@/components/shared/Skeleton";

export default function ToolsLoading() {
  return (
    <div className="flex-1 min-h-screen bg-background pb-12">
      {/* Hero Skeleton */}
      <header className="px-6 pt-10 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="w-10 h-10 rounded-2xl bg-white/5" />
          <Skeleton className="w-24 h-3 bg-white/5" />
        </div>
        <Skeleton className="w-64 h-8 bg-white/5 mb-3" />
        <Skeleton className="w-full h-4 bg-white/5 max-w-sm" />
      </header>

      {/* Featured Tool Skeleton */}
      <section className="px-6 mb-10">
        <Skeleton className="w-full h-48 rounded-[2rem] bg-white/5" />
      </section>

      {/* Grid Skeleton */}
      <section className="px-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="w-24 h-4 bg-white/5" />
          <div className="h-px flex-1 bg-white/5 ml-4" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="w-full h-32 rounded-[2rem] bg-white/5" />
          ))}
        </div>
      </section>

      {/* Footer Skeleton */}
      <section className="px-6 mt-16 pb-10">
        <Skeleton className="w-full h-24 rounded-[2rem] bg-white/5" />
      </section>
    </div>
  );
}
