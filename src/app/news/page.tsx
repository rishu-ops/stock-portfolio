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
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2 text-white">Market News</h1>
          <p className="text-xs text-gray-400">
            Cached for 30 seconds · Last regenerated at {generatedAtLabel}
          </p>
        </div>

        <div className="space-y-3">
          {data.articles.map((article) => (
            <article
              key={article.id}
              className="bg-[#1c2228] border border-[#262d35] rounded-lg p-4 hover:border-[#363f48] transition-colors"
            >
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">
                  {article.category}
                </span>
                <span className="text-xs text-gray-600">·</span>
                <span className="text-xs text-gray-400">{article.source}</span>
                <span className="text-xs text-gray-600">·</span>
                <span className="text-xs text-gray-400">
                  {timeAgo(article.publishedAt, refTime)}
                </span>
              </div>
              <h2 className="text-base font-semibold text-white mb-1">
                {article.title}
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                {article.summary}
              </p>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
