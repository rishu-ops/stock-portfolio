import Header from "@/components/Header";

export default function Loading() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Summary skeleton */}
        <div className="mb-6">
          <div className="h-7 w-40 bg-[#1c2228] rounded mb-3 animate-pulse" />
          <div className="flex items-baseline gap-3 flex-wrap mb-2">
            <div className="h-9 w-44 bg-[#1c2228] rounded animate-pulse" />
            <div className="h-5 w-32 bg-[#1c2228] rounded animate-pulse" />
          </div>
          <div className="h-3 w-56 bg-[#1c2228] rounded animate-pulse" />
        </div>

        {/* Table skeleton */}
        <div className="bg-[#1c2228] border border-[#262d35] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#262d35] flex items-center justify-between">
            <div className="h-5 w-24 bg-[#262d35] rounded animate-pulse" />
            <div className="h-3 w-32 bg-[#262d35] rounded animate-pulse" />
          </div>

          <div className="px-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-[#262d35] last:border-0"
              >
                <div className="h-4 w-14 bg-[#262d35] rounded animate-pulse" />
                <div className="hidden sm:flex gap-6">
                  <div className="h-4 w-10 bg-[#262d35] rounded animate-pulse" />
                  <div className="h-4 w-20 bg-[#262d35] rounded animate-pulse" />
                  <div className="h-4 w-20 bg-[#262d35] rounded animate-pulse" />
                  <div className="h-4 w-16 bg-[#262d35] rounded animate-pulse" />
                </div>
                <div className="h-4 w-20 bg-[#262d35] rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
