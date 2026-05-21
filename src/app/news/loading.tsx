import Header from "@/components/Header";

export default function Loading() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="h-7 w-40 bg-[#1c2228] rounded mb-2 animate-pulse" />
          <div className="h-3 w-64 bg-[#1c2228] rounded animate-pulse" />
        </div>

        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#1c2228] border border-[#262d35] rounded-lg p-4 animate-pulse"
            >
              <div className="h-3 w-40 bg-[#262d35] rounded mb-3" />
              <div className="h-4 w-3/4 bg-[#262d35] rounded mb-2" />
              <div className="h-3 w-full bg-[#262d35] rounded mb-1" />
              <div className="h-3 w-5/6 bg-[#262d35] rounded" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
