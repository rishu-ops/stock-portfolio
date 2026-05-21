'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Email and password are required')
      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      if (res.ok) {
        toast.success('Signed in successfully')
        router.push('/dashboard')
        router.refresh()
        return
      }

      const data = await res.json().catch(() => ({}))
      const message = data.error || 'Login failed'
      setError(message)
      toast.error(message)
    } catch {
      const message = 'Network error, please try again'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-[#262d35]">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center">
          <span className="text-lg font-bold">
            <span className="text-indigo-400">FinApp</span>
            <span className="text-white"> Finance</span>
          </span>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-[#1c2228] border border-[#262d35] rounded-lg overflow-hidden">
            <div className="h-1 bg-indigo-500" />
            <div className="p-8">
              <h1 className="text-2xl font-semibold mb-1 text-white">
                Sign in
              </h1>
              <p className="text-sm text-gray-400 mb-6">
                to continue to your portfolio
              </p>

              <form onSubmit={handleSubmit} noValidate>
              {error && (
                <div className="mb-4 p-3 bg-red-950/40 border border-red-800 text-red-300 text-sm rounded">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm mb-1 text-gray-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#14181c] border border-[#2d343c] rounded text-white focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                  autoComplete="email"
                  disabled={loading}
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm mb-1 text-gray-300"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-[#14181c] border border-[#2d343c] rounded text-white focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                  autoComplete="current-password"
                  disabled={loading}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-500 disabled:bg-indigo-900 disabled:text-gray-400"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
            </div>
          </div>

          <div className="mt-4 px-4 py-3 bg-[#1c2228]/60 border border-[#262d35] rounded text-xs text-gray-400 flex items-center justify-between gap-2">
            <span className="text-gray-500">Demo credentials</span>
            <span className="font-mono text-gray-300">
              test@finapp.com / 123456
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
