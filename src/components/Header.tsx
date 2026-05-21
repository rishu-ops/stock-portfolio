"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/logout", { method: "POST" });
      toast.success("Signed out");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Could not sign out, please try again");
      setLoggingOut(false);
    }
  }

  function NavItem({
    href,
    label,
    mobileLabel,
  }: {
    href: string;
    label: string;
    mobileLabel?: string;
  }) {
    const active = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        href={href}
        className={
          "group relative h-full flex items-center px-3 sm:px-4 text-sm font-medium transition-colors " +
          (active ? "text-white" : "text-gray-400 hover:text-white")
        }
      >
        <span className="hidden sm:inline">{label}</span>
        <span className="sm:hidden">{mobileLabel ?? label}</span>
        <span
          className={
            "absolute inset-x-3 sm:inset-x-4 bottom-0 h-0.5 rounded-t transition-colors " +
            (active
              ? "bg-indigo-400"
              : "bg-transparent group-hover:bg-gray-700")
          }
        />
      </Link>
    );
  }

  return (
    <header className="bg-[#14181c] border-b border-[#262d35] sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
        <Link
          href="/dashboard"
          className="text-base sm:text-lg font-bold whitespace-nowrap shrink-0"
        >
          <span className="text-indigo-400">FinApp</span>
          <span className="text-white hidden sm:inline"> Finance</span>
        </Link>

        <nav className="flex items-center h-full">
          <NavItem
            href="/dashboard"
            label="My Portfolio"
            mobileLabel="Portfolio"
          />
          <NavItem href="/news" label="News" />
        </nav>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="text-xs sm:text-sm text-gray-300 bg-[#1c2228] hover:bg-[#262d35] border border-[#2d343c] hover:border-[#3a424c] px-3 py-1.5 rounded-md hover:text-white disabled:opacity-50 whitespace-nowrap transition-colors"
        >
          {loggingOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </header>
  );
}
