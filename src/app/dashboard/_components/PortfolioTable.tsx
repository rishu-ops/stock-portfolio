import type { Stock } from '@/types/portfolio'

function formatCurrency(n: number) {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
}

export default function PortfolioTable({ portfolio }: { portfolio: Stock[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[11px] uppercase tracking-wider text-gray-500 bg-[#181d23] border-b border-[#262d35]">
            <th className="px-4 py-2.5 text-left font-semibold">Symbol</th>
            <th className="px-4 py-2.5 text-right font-semibold">Qty</th>
            <th className="px-4 py-2.5 text-right font-semibold">Avg Price</th>
            <th className="px-4 py-2.5 text-right font-semibold">Current</th>
            <th className="px-4 py-2.5 text-right font-semibold">Change</th>
            <th className="px-4 py-2.5 text-right font-semibold">P/L</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map((stock) => {
            const change = stock.price - stock.avg
            const changePct = (change / stock.avg) * 100
            const pl = change * stock.qty
            const positive = pl >= 0
            const color = positive ? 'text-green-400' : 'text-red-400'
            const arrow = positive ? '▲' : '▼'

            return (
              <tr
                key={stock.symbol}
                className="border-b border-[#262d35] last:border-0 hover:bg-[#222932] transition-colors"
              >
                <td className="px-4 py-3.5">
                  <span className="font-semibold text-indigo-400">
                    {stock.symbol}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right tabular-nums text-gray-200">
                  {stock.qty}
                </td>
                <td className="px-4 py-3.5 text-right tabular-nums text-gray-300">
                  {formatCurrency(stock.avg)}
                </td>
                <td className="px-4 py-3.5 text-right tabular-nums font-medium text-white">
                  {formatCurrency(stock.price)}
                </td>
                <td className={`px-4 py-3.5 text-right tabular-nums ${color}`}>
                  <span className="mr-1 text-[10px]">{arrow}</span>
                  {positive ? '+' : ''}
                  {changePct.toFixed(2)}%
                </td>
                <td
                  className={`px-4 py-3.5 text-right tabular-nums font-semibold ${color}`}
                >
                  {positive ? '+' : ''}
                  {formatCurrency(pl)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
