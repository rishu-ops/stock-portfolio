"use client";

import { useEffect, useState } from "react";
import PortfolioTable from "./PortfolioTable";
import type { Stock } from "@/types/portfolio";

const TICK_INTERVAL_MS = 2500;
const MAX_DRIFT = 0.005;

function drift(price: number): number {
  const delta = (Math.random() * 2 - 1) * MAX_DRIFT;
  const next = price * (1 + delta);
  return Math.max(next, 1);
}

function formatCurrency(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

type Props = {
  initialPortfolio: Stock[];
};

export default function LivePortfolio({ initialPortfolio }: Props) {
  const [portfolio, setPortfolio] = useState(initialPortfolio);

  useEffect(() => {
    const id = setInterval(() => {
      setPortfolio((prev) =>
        prev.map((s) => ({ ...s, price: drift(s.price) })),
      );
    }, TICK_INTERVAL_MS);

    return () => clearInterval(id);
  }, []);

  const invested = portfolio.reduce((sum, s) => sum + s.avg * s.qty, 0);
  const currentValue = portfolio.reduce((sum, s) => sum + s.price * s.qty, 0);
  const totalPL = currentValue - invested;
  const totalPLPct = invested > 0 ? (totalPL / invested) * 100 : 0;
  const positive = totalPL >= 0;
  const plColor = positive ? "text-green-400" : "text-red-400";

  return (
    <>
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

      <div className="bg-[#1c2228] border border-[#262d35] rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-[#262d35] flex items-center justify-between">
          <h2 className="font-semibold text-white">Holdings</h2>
          <span className="flex items-center gap-2 text-xs text-gray-400">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Live · updates every 2.5s
          </span>
        </div>
        <PortfolioTable portfolio={portfolio} />
      </div>
    </>
  );
}
