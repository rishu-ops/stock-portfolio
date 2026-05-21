import type { Stock } from '@/types/portfolio'

type Props = {
  portfolio: Stock[]
}

function formatCurrency(n: number) {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
}

export default function PortfolioTable({ portfolio }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="font-semibold text-slate-900">Holdings</h2>
        <p className="text-sm text-slate-500">
          Your current stock positions
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/60 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-6 py-3 text-left font-medium">Symbol</th>
              <th className="px-6 py-3 text-right font-medium">Quantity</th>
              <th className="px-6 py-3 text-right font-medium">Avg Price</th>
              <th className="px-6 py-3 text-right font-medium">Current</th>
              <th className="px-6 py-3 text-right font-medium">P/L</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {portfolio.map((stock) => {
              const pl = (stock.price - stock.avg) * stock.qty
              const positive = pl >= 0
              return (
                <tr key={stock.symbol} className="hover:bg-slate-50/60">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-900">
                      {stock.symbol}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-700">
                    {stock.qty}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-700 tabular-nums">
                    {formatCurrency(stock.avg)}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-900 font-medium tabular-nums">
                    {formatCurrency(stock.price)}
                  </td>
                  <td className="px-6 py-4 text-right tabular-nums">
                    <span
                      className={
                        'inline-flex items-center gap-1 font-medium ' +
                        (positive ? 'text-emerald-600' : 'text-red-600')
                      }
                    >
                      {positive ? '▲' : '▼'} {formatCurrency(Math.abs(pl))}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
