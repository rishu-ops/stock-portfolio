import { cookies, headers } from "next/headers";
import Header from "@/components/Header";
import PortfolioTable from "./_components/PortfolioTable";
import type { Stock } from "@/types/portfolio";

export const dynamic = "force-dynamic";

async function getPortfolio(): Promise<Stock[]> {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${protocol}://${host}`;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await fetch(`${baseUrl}/api/portfolio`, {
    headers: { Cookie: cookieHeader },
    cache: "no-store",
  });

  if (!res.ok) {
    console.log(`[dashboard] portfolio fetch failed: ${res.status}`);
    throw new Error(`Failed to load portfolio (${res.status})`);
  }

  const data = await res.json();
  return data.portfolio;
}

function formatCurrency(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export default async function DashboardPage() {
  const portfolio = await getPortfolio();

  const invested = portfolio.reduce((sum, s) => sum + s.avg * s.qty, 0);
  const currentValue = portfolio.reduce((sum, s) => sum + s.price * s.qty, 0);
  const totalPL = currentValue - invested;
  const totalPLPct = invested > 0 ? (totalPL / invested) * 100 : 0;
  const positive = totalPL >= 0;
  const plColor = positive ? "text-green-400" : "text-red-400";

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Portfolio summary */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2 text-white">My Portfolio</h1>
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-3xl font-bold tabular-nums text-white">
              {formatCurrency(currentValue)}
            </span>
            <span className={`text-base font-semibold tabular-nums ${plColor}`}>
              {positive ? "+" : ""}
              {formatCurrency(totalPL)} ({positive ? "+" : ""}
              {totalPLPct.toFixed(2)}%)
            </span>
          </div>
          <p className="text-xs text-gray-300 mt-1">
            Total invested: {formatCurrency(invested)} · USD
          </p>
        </div>

        {/* Holdings */}
        <div className="bg-[#1c2228] border border-[#262d35] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#262d35]">
            <h2 className="font-semibold text-white">Holdings</h2>
          </div>
          <PortfolioTable portfolio={portfolio} />
        </div>
      </main>
    </div>
  );
}
