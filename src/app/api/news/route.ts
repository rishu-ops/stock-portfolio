import { NextResponse } from "next/server";
import type { NewsArticle } from "@/types/news";

export async function GET() {
  const now = Date.now();
  const minute = 60 * 1000;
  const hour = 60 * minute;

  const articles: NewsArticle[] = [
    {
      id: "n1",
      title: "Market hits all-time high as tech stocks rally",
      source: "Reuters",
      category: "Markets",
      summary:
        "Major indices closed at record levels on Friday driven by strong quarterly earnings from large-cap technology companies.",
      publishedAt: new Date(now - 25 * minute).toISOString(),
    },
    {
      id: "n2",
      title: "Tech stocks rally continues into a third week",
      source: "Bloomberg",
      category: "Stocks",
      summary:
        "Investor optimism around AI infrastructure spending has pushed the sector up nearly 12% this month.",
      publishedAt: new Date(now - 2 * hour).toISOString(),
    },
    {
      id: "n3",
      title: "Federal Reserve signals patience on rate cuts",
      source: "Wall Street Journal",
      category: "Economy",
      summary:
        "Minutes from the latest FOMC meeting show officials want to see further evidence of disinflation before easing policy.",
      publishedAt: new Date(now - 4 * hour).toISOString(),
    },
    {
      id: "n4",
      title: "Oil prices ease as supply concerns fade",
      source: "CNBC",
      category: "Commodities",
      summary:
        "Brent crude settled lower for a second consecutive session as inventory data pointed to easing supply pressure.",
      publishedAt: new Date(now - 6 * hour).toISOString(),
    },
    {
      id: "n5",
      title: "Apple announces new chip lineup at developer event",
      source: "The Verge",
      category: "Tech",
      summary:
        "The company unveiled its next generation of M-series processors with focus on on-device machine learning performance.",
      publishedAt: new Date(now - 9 * hour).toISOString(),
    },
    {
      id: "n6",
      title: "Tesla deliveries beat analyst expectations",
      source: "Financial Times",
      category: "Auto",
      summary:
        "Q1 delivery figures came in above consensus estimates, sending shares up nearly 4% in pre-market trading.",
      publishedAt: new Date(now - 12 * hour).toISOString(),
    },
  ];

  return NextResponse.json({
    articles,
    generatedAt: new Date(now).toISOString(),
  });
}
