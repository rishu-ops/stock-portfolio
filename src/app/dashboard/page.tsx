import { cookies, headers } from "next/headers";
import Header from "@/components/Header";
import LivePortfolio from "./_components/LivePortfolio";
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

export default async function DashboardPage() {
  const portfolio = await getPortfolio();

  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        <LivePortfolio initialPortfolio={portfolio} />
      </main>
    </div>
  );
}
