"use client";

import { useEffect } from "react";
import Header from "@/components/Header";

type Props = {
  error: Error;
  reset: () => void;
};

export default function DashboardError({ error, reset }: Props) {
  useEffect(() => {
    console.error("[dashboard] render error:", error);
  }, [error]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-[#1c2228] border border-red-900 rounded-lg p-6">
          <h1 className="text-lg font-semibold text-white mb-1">
            Couldn&apos;t load your portfolio
          </h1>
          <p className="text-sm text-gray-400 mb-4">
            Something went wrong while fetching your holdings.
          </p>
          <button
            onClick={reset}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-500"
          >
            Try again
          </button>
        </div>
      </main>
    </div>
  );
}
