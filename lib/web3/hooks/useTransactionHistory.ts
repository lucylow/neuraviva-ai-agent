"use client"

import { useState, useCallback } from "react"
import type { PublicKey } from "@solana/web3.js"
import type { TransactionDetails } from "../types/blockchain"

export const useTransactionHistory = () => {
  const [transactions, setTransactions] = useState<TransactionDetails[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadTransactions = useCallback(async (address: PublicKey, limit = 10) => {
    setLoading(true)
    setError(null)

    try {
      // Mock data - in production this would fetch from Solana
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockTransactions: TransactionDetails[] = Array.from({ length: limit }, (_, i) => ({
        signature: `mock_sig_${i}_${Date.now()}`,
        timestamp: new Date(Date.now() - i * 3600000),
        status: i % 10 === 0 ? "failed" : ("confirmed" as const),
        block: 100000 + i,
        fee: 5000,
        instructions: [],
        metadata: {
          type: ["data_registration", "data_verification", "nft_mint"][i % 3] as any,
          dataId: `data_${i}`,
          dataHash: `hash_${i}`,
          cid: `Qm${i}`,
        },
      }))

      setTransactions(mockTransactions)
    } catch (error: any) {
      setError(error.message)
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }, [])

  const refresh = useCallback(() => {
    // Refresh logic
  }, [])

  return {
    transactions,
    loading,
    error,
    loadTransactions,
    refresh,
  }
}
