'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await fetch('/api/logout', { method: 'POST' })
      router.push('/login')
      router.refresh()
    } catch {
      setLoggingOut(false)
    }
  }

  const navLink = (href: string, label: string) => {
    const active = pathname === href || pathname.startsWith(href + '/')
    return (
      <Link
        href={href}
        className={
          'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ' +
          (active
            ? 'bg-slate-900 text-white'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
        }
      >
        {label}
      </Link>
    )
  }

  return (
    <header className="bg-white/80 backdrop-blur border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-sm shadow-blue-600/30">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-white"
            >
              <path d="M3 17l6-6 4 4 8-8" />
              <path d="M14 7h7v7" />
            </svg>
          </div>
          <span className="font-semibold text-slate-900 tracking-tight">
            FinApp
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navLink('/dashboard', 'Dashboard')}
          {navLink('/news', 'News')}
        </nav>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loggingOut ? 'Signing out...' : 'Sign out'}
        </button>
      </div>
    </header>
  )
}
