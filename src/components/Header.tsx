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
          "h-full flex items-center px-2 sm:px-3 text-sm font-medium border-b-2 " +
          (active
            ? "border-indigo-400 text-white"
            : "border-transparent text-gray-400 hover:text-white")
        }
      >
        <span className="hidden sm:inline">{label}</span>
        <span className="sm:hidden">{mobileLabel ?? label}</span>
      </Link>
    );
  }

  return (
    <header className="bg-[#14181c] border-b border-[#262d35]">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2">
        <Link
          href="/dashboard"
          className="text-base sm:text-lg font-bold whitespace-nowrap"
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
          className="text-xs sm:text-sm text-gray-300 border border-gray-500 px-3 py-1.5 rounded-full hover:text-white hover:border-gray-300 disabled:opacity-50 whitespace-nowrap"
        >
          {loggingOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </header>
  );
}
