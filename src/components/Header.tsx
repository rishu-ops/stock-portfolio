"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  }

  function NavItem({ href, label }: { href: string; label: string }) {
    const active = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        href={href}
        className={
          "h-full flex items-center px-3 text-sm font-medium border-b-2 " +
          (active
            ? "border-indigo-400 text-white"
            : "border-transparent text-gray-400 hover:text-white")
        }
      >
        {label}
      </Link>
    );
  }

  return (
    <header className="bg-[#14181c] border-b border-[#262d35]">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="text-lg font-bold">
          <span className="text-indigo-400">FinApp</span>
          <span className="text-white"> Finance</span>
        </Link>

        <nav className="flex items-center h-full">
          <NavItem href="/dashboard" label="My Portfolio" />
          <NavItem href="/news" label="News" />
        </nav>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="text-sm text-gray-300 border border-gray-400 p-2 rounded-full hover:text-white disabled:opacity-50"
        >
          {loggingOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </header>
  );
}
