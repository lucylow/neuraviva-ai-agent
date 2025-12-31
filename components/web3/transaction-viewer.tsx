"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, Clock, ExternalLink, Copy, ChevronRight } from "lucide-react"
import { useTransactionHistory } from "@/lib/web3/hooks/useTransactionHistory"
import { formatAddress, formatSOL, formatTimeAgo } from "@/lib/web3/utils/blockchainFormatters"

interface TransactionViewerProps {
  address?: string
  limit?: number
  className?: string
  showDetails?: boolean
}

export default function TransactionViewer({
  address,
  limit = 10,
  className = "",
  showDetails = false,
}: TransactionViewerProps) {
  const { transactions, loading, error, loadTransactions } = useTransactionHistory()
  const [expandedTx, setExpandedTx] = useState<string | null>(null)

  useEffect(() => {
    if (address) {
      loadTransactions(address as any, limit)
    }
  }, [address, limit, loadTransactions])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500 animate-pulse" />
      default:
        return null
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "data_registration":
        return "bg-purple-100 text-purple-800"
      case "data_verification":
        return "bg-blue-100 text-blue-800"
      case "nft_mint":
        return "bg-green-100 text-green-800"
      case "transfer":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const openExplorer = (signature: string) => {
    window.open(`https://explorer.solana.com/tx/${signature}`, "_blank")
  }

  const copySignature = (signature: string) => {
    navigator.clipboard.writeText(signature)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <div className="text-center py-8 text-red-600">Error loading transactions: {error}</div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-xl shadow ${className}`}>
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
        <p className="text-sm text-gray-500 mt-1">Recent blockchain transactions</p>
      </div>

      <div className="divide-y">
        {transactions.map((tx) => (
          <div key={tx.signature} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                {getStatusIcon(tx.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {tx.metadata?.type && (
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(tx.metadata.type)}`}>
                        {tx.metadata.type.replace(/_/g, " ")}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">{formatTimeAgo(tx.timestamp)}</span>
                  </div>
                  <div className="font-mono text-sm text-gray-800 truncate">{formatAddress(tx.signature, 12)}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Block {tx.block.toLocaleString()} • Fee {formatSOL(tx.fee / 1e9)} SOL
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copySignature(tx.signature)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title="Copy signature"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={() => openExplorer(tx.signature)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title="View in explorer"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
                {showDetails && (
                  <button
                    onClick={() => setExpandedTx(expandedTx === tx.signature ? null : tx.signature)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${expandedTx === tx.signature ? "rotate-90" : ""}`}
                    />
                  </button>
                )}
              </div>
            </div>

            {expandedTx === tx.signature && (
              <div className="mt-3 p-4 bg-gray-50 rounded-lg border text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-500 mb-1">Signature</div>
                    <div className="font-mono text-xs break-all">{tx.signature}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Block</div>
                    <div>{tx.block.toLocaleString()}</div>
                  </div>
                  {tx.metadata?.dataId && (
                    <div>
                      <div className="text-gray-500 mb-1">Data ID</div>
                      <div className="font-mono text-xs">{tx.metadata.dataId}</div>
                    </div>
                  )}
                  {tx.metadata?.dataHash && (
                    <div>
                      <div className="text-gray-500 mb-1">Data Hash</div>
                      <div className="font-mono text-xs truncate">{tx.metadata.dataHash}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {transactions.length === 0 && <div className="p-8 text-center text-gray-500">No transactions found</div>}
    </div>
  )
}
