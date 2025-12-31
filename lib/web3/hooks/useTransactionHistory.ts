"use client"

import { useState, useCallback } from "react"
import type { PublicKey } from "@solana/web3.js"
import type { TransactionDetails } from "../types/blockchain"

export const useTransactionHistory = () => {
  const [transactions, setTransactions] = useState<TransactionDetails[]>([
    {
      signature: "5KYmYvQ8b3vzMBqYcTiS2UPiChWqnU3m8FJBYoQKE6YgHUvf3iJc8AZxXKZjE9K7qPR4wYJY3vC8yUz2J5K8mD8Q",
      timestamp: new Date(Date.now() - 1 * 3600000),
      status: "confirmed" as const,
      block: 187453291,
      fee: 5000,
      instructions: [],
      metadata: {
        type: "data_registration" as any,
        dataId: "docking_run_2024_001",
        dataHash: "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
        cid: "QmXyZ1234567890ABCDEF",
      },
    },
    {
      signature: "2YvQ8b3vzMBqYcTiS2UPiChWqnU3m8FJBYoQKE6YgHUvf3iJc8AZxXKZjE9K7qPR4wYJY3vC8yUz2J5K8mD8Q5KYm",
      timestamp: new Date(Date.now() - 3 * 3600000),
      status: "confirmed" as const,
      block: 187453155,
      fee: 5000,
      instructions: [],
      metadata: {
        type: "data_verification" as any,
        dataId: "docking_run_2024_002",
        dataHash: "0x8a94c2681fc43b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
        cid: "QmABC9876543210FEDCBA",
      },
    },
    {
      signature: "9K7qPR4wYJY3vC8yUz2J5K8mD8Q5KYmYvQ8b3vzMBqYcTiS2UPiChWqnU3m8FJBYoQKE6YgHUvf3iJc8AZxXKZjE",
      timestamp: new Date(Date.now() - 5 * 3600000),
      status: "confirmed" as const,
      block: 187453089,
      fee: 5000,
      instructions: [],
      metadata: {
        type: "nft_mint" as any,
        dataId: "docking_run_2024_003",
        dataHash: "0xa3d677284addd200126d90697f83b1657ff1fc53b92dc18148a1d65dfc2d4b1f",
        cid: "QmDEF5678901234567890",
      },
    },
    {
      signature: "3vzMBqYcTiS2UPiChWqnU3m8FJBYoQKE6YgHUvf3iJc8AZxXKZjE9K7qPR4wYJY3vC8yUz2J5K8mD8Q5KYmYvQ8b",
      timestamp: new Date(Date.now() - 8 * 3600000),
      status: "confirmed" as const,
      block: 187452950,
      fee: 5000,
      instructions: [],
      metadata: {
        type: "data_registration" as any,
        dataId: "protein_analysis_2024",
        dataHash: "0xfc2d4b1fa3d677284addd200126d90697f83b1657ff1fc53b92dc18148a1d65d",
        cid: "QmGHI3456789012345678",
      },
    },
  ])
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
