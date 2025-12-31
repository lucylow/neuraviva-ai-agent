"use client"

import { useState, useCallback } from "react"
import type { VerificationResult } from "../types/blockchain"

export const useBlockchainVerification = () => {
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isDataRegistered = useCallback(async (dataId: string): Promise<boolean> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return Math.random() > 0.5
    } catch (error) {
      return false
    }
  }, [])

  const verifyData = useCallback(async (dataId: string, computedHash: string): Promise<VerificationResult> => {
    setLoading(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const match = Math.random() > 0.3
      const result: VerificationResult = {
        verified: match,
        onChainHash: match ? computedHash : "different_hash",
        computedHash,
        match,
        transaction: "mock_tx_signature",
        timestamp: new Date(),
        block: 123456,
      }

      setVerificationResult(result)
      return result
    } catch (error: any) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    verifyData,
    verificationResult,
    loading,
    error,
    isDataRegistered,
  }
}
