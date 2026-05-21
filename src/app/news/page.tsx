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
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata",
    },
  );

  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        <div className="mb-6 flex items-end justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Market News
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {data.articles.length} stories · cached for 30s
            </p>
          </div>
          <p className="text-xs text-gray-500">
            Last regenerated at {generatedAtLabel}
          </p>
        </div>

        <div className="space-y-4">
          {data.articles.map((article) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-[#1c2228] border border-[#262d35] rounded-lg px-4 py-3 hover:border-indigo-500/40 hover:bg-[#1f262d] transition-colors"
            >
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider border px-1.5 py-0.5 rounded"
                  style={{
                    color: article.tagColor,
                    backgroundColor: `${article.tagColor}1a`,
                    borderColor: `${article.tagColor}33`,
                  }}
                >
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

              <h2 className="text-[15px] sm:text-base font-semibold text-white mb-1 hover:underline group-hover:text-indigo-300 transition-colors leading-snug">
                {article.title}
              </h2>

              <p className="text-sm text-gray-400 leading-snug line-clamp-2">
                {article.summary}
              </p>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
