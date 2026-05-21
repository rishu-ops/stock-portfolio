import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { AUTH_COOKIE_NAME, verifySessionToken } from '@/lib/auth'
import type { Stock } from '@/types/portfolio'

const MOCK_PORTFOLIO: Stock[] = [
  { symbol: 'AAPL', qty: 10, avg: 150, price: 170 },
  { symbol: 'TSLA', qty: 5, avg: 700, price: 650 },
  { symbol: 'MSFT', qty: 8, avg: 280, price: 315 },
  { symbol: 'GOOGL', qty: 3, avg: 130, price: 142 },
  { symbol: 'AMZN', qty: 4, avg: 145, price: 138 },
]

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
  const session = token ? await verifySessionToken(token) : null

  if (!session) {
    console.log('[portfolio] unauthorized access attempt')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ portfolio: MOCK_PORTFOLIO })
}
