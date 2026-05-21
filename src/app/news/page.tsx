import { headers } from "next/headers";
import Header from "@/components/Header";
import type { NewsResponse } from "@/types/news";

export const revalidate = 30;

async function getNews(): Promise<NewsResponse> {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${protocol}://${host}`;

  const res = await fetch(`${baseUrl}/api/news`, {
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    console.log(`[news] fetch failed: ${res.status}`);
    throw new Error(`Failed to load news (${res.status})`);
  }

  return res.json();
}

function timeAgo(iso: string, referenceTime: number): string {
  const seconds = Math.max(
    0,
    Math.floor((referenceTime - new Date(iso).getTime()) / 1000),
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default async function NewsPage() {
  const data = await getNews();
  const refTime = new Date(data.generatedAt).getTime();
  const generatedAtLabel = new Date(data.generatedAt).toLocaleTimeString(
    "en-US",
    { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false },
  );

  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold mb-2 text-white">
            Market News
          </h1>
          <p className="text-xs text-gray-400">
            Cached for 30 seconds · Last regenerated at {generatedAtLabel}
          </p>
        </div>

        <div className="space-y-3">
          {data.articles.map((article) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-[#1c2228] border border-[#262d35] rounded-lg p-5 hover:border-indigo-500/50 hover:bg-[#1f262d] transition-colors"
            >
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[10px] font-semibold text-indigo-300 uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                  {article.category}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  {article.source}
                </span>
                <span className="text-xs text-gray-600">·</span>
                <span className="text-xs text-gray-500">
                  {timeAgo(article.publishedAt, refTime)}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                {article.title}
              </h2>

              <p className="text-sm text-gray-400 leading-relaxed">
                {article.summary}
              </p>

              <div className="mt-3 flex items-center gap-1 text-xs font-medium text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Read on {article.source}
                <span aria-hidden>→</span>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
