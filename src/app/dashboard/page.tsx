import { cookies, headers } from 'next/headers'
import Header from '@/components/Header'
import PortfolioTable from './_components/PortfolioTable'
import type { Stock } from '@/types/portfolio'

export const dynamic = 'force-dynamic'

async function getPortfolio(): Promise<Stock[]> {
  const headersList = await headers()
  const host = headersList.get('host')
  const protocol = headersList.get('x-forwarded-proto') ?? 'http'
  const baseUrl = `${protocol}://${host}`

  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()

  const res = await fetch(`${baseUrl}/api/portfolio`, {
    headers: { Cookie: cookieHeader },
    cache: 'no-store',
  })

  if (!res.ok) {
    console.log(`[dashboard] portfolio fetch failed: ${res.status}`)
    throw new Error(`Failed to load portfolio (${res.status})`)
  }

  const data = await res.json()
  return data.portfolio
}

function formatCurrency(n: number) {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

export default async function DashboardPage() {
  const portfolio = await getPortfolio()

  const invested = portfolio.reduce((sum, s) => sum + s.avg * s.qty, 0)
  const currentValue = portfolio.reduce((sum, s) => sum + s.price * s.qty, 0)
  const totalPL = currentValue - invested
  const totalPLPct = invested > 0 ? (totalPL / invested) * 100 : 0
  const positive = totalPL >= 0

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Portfolio
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Server-rendered on every request
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <SummaryCard label="Invested" value={formatCurrency(invested)} />
          <SummaryCard
            label="Current Value"
            value={formatCurrency(currentValue)}
          />
          <SummaryCard
            label="Total P/L"
            value={`${positive ? '+' : '−'} ${formatCurrency(Math.abs(totalPL))}`}
            sublabel={`${positive ? '+' : ''}${totalPLPct.toFixed(2)}%`}
            tone={positive ? 'positive' : 'negative'}
          />
        </div>

        <PortfolioTable portfolio={portfolio} />
      </main>
    </div>
  )
}

type SummaryProps = {
  label: string
  value: string
  sublabel?: string
  tone?: 'positive' | 'negative' | 'neutral'
}

function SummaryCard({ label, value, sublabel, tone = 'neutral' }: SummaryProps) {
  const valueColor =
    tone === 'positive'
      ? 'text-emerald-600'
      : tone === 'negative'
        ? 'text-red-600'
        : 'text-slate-900'

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">
        {label}
      </p>
      <p className={`mt-2 text-2xl font-semibold tabular-nums ${valueColor}`}>
        {value}
      </p>
      {sublabel && (
        <p className={`mt-1 text-sm font-medium ${valueColor}`}>{sublabel}</p>
      )}
    </div>
  )
}
