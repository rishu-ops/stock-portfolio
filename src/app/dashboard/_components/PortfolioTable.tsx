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
          <tr className="text-xs uppercase text-gray-500 border-b border-[#262d35]">
            <th className="px-4 py-2 text-left font-medium">Symbol</th>
            <th className="px-4 py-2 text-right font-medium">Qty</th>
            <th className="px-4 py-2 text-right font-medium">Avg Price</th>
            <th className="px-4 py-2 text-right font-medium">Current</th>
            <th className="px-4 py-2 text-right font-medium">Day's Change</th>
            <th className="px-4 py-2 text-right font-medium">P/L</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map((stock) => {
            const change = stock.price - stock.avg
            const changePct = (change / stock.avg) * 100
            const pl = change * stock.qty
            const positive = pl >= 0
            const color = positive ? 'text-green-400' : 'text-red-400'

            return (
              <tr
                key={stock.symbol}
                className="border-b border-[#262d35] last:border-0 hover:bg-[#222932]"
              >
                <td className="px-4 py-3 font-semibold text-indigo-400">
                  {stock.symbol}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-gray-200">
                  {stock.qty}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-gray-300">
                  {formatCurrency(stock.avg)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-medium text-white">
                  {formatCurrency(stock.price)}
                </td>
                <td className={`px-4 py-3 text-right tabular-nums ${color}`}>
                  {positive ? '+' : ''}
                  {changePct.toFixed(2)}%
                </td>
                <td
                  className={`px-4 py-3 text-right tabular-nums font-medium ${color}`}
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
