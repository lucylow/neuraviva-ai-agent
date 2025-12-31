"use client"

import { useState } from "react"
import { Wallet, TrendingUp, TrendingDown } from "lucide-react"

interface TokenBalanceProps {
  showAll?: boolean
  className?: string
}

export default function TokenBalance({ showAll = false, className = "" }: TokenBalanceProps) {
  const [tokens] = useState([
    { symbol: "SOL", name: "Solana", balance: 5.2341, decimals: 9, uiAmount: 5.2341, change: 2.4 },
    { symbol: "USDC", name: "USD Coin", balance: 1250.5, decimals: 6, uiAmount: 1250.5, change: 0.1 },
    { symbol: "NVIVA", name: "NeuraViva Token", balance: 10000, decimals: 9, uiAmount: 10000, change: -1.2 },
  ])

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-100 ${className}`}>
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Token Balances</h3>
            <p className="text-sm text-gray-500 mt-1">Your wallet token holdings</p>
          </div>
          <Wallet className="h-6 w-6 text-purple-600" />
        </div>
      </div>

      <div className="divide-y">
        {tokens.map((token) => (
          <div key={token.symbol} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                  {token.symbol.slice(0, 2)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{token.name}</div>
                  <div className="text-sm text-gray-500">{token.symbol}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {token.balance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: token.decimals,
                  })}
                </div>
                <div className="flex items-center gap-1 text-sm">
                  {token.change > 0 ? (
                    <>
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-green-600">+{token.change}%</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-3 w-3 text-red-600" />
                      <span className="text-red-600">{token.change}%</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!showAll && tokens.length > 3 && (
        <div className="p-4 border-t">
          <button className="w-full text-center text-sm text-purple-600 hover:text-purple-700 font-medium">
            View All Tokens →
          </button>
        </div>
      )}
    </div>
  )
}
