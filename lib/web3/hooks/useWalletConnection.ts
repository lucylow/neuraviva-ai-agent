"use client"

import { useState, useCallback, useEffect } from "react"
import { PhantomWalletService } from "@/lib/web3/phantom"

export const useWalletConnection = () => {
  const [balance, setBalance] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [network, setNetwork] = useState<string>("devnet")
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)
  const [walletService] = useState(() => new PhantomWalletService())

  useEffect(() => {
    const checkConnection = async () => {
      if (walletService.isConnected()) {
        const key = walletService.getPublicKey()
        setPublicKey(key)
        setConnected(true)
        await refreshBalance()
      }
    }
    checkConnection()
  }, [])

  useEffect(() => {
    if (!walletService.isAvailable()) return

    const cleanupAccountChange = walletService.onAccountChange((newPublicKey) => {
      setPublicKey(newPublicKey)
      if (newPublicKey) {
        refreshBalance()
      }
    })

    const cleanupDisconnect = walletService.onDisconnect(() => {
      setConnected(false)
      setPublicKey(null)
      setBalance(0)
    })

    return () => {
      cleanupAccountChange?.()
      cleanupDisconnect?.()
    }
  }, [])

  const connect = useCallback(async () => {
    if (!walletService.isAvailable()) {
      throw new Error("Phantom wallet is not installed")
    }

    setLoading(true)
    setError(null)
    try {
      const key = await walletService.connect()
      setPublicKey(key)
      setConnected(true)
      await refreshBalance()
      return key
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to connect wallet"
      console.error("[v0] Failed to connect wallet:", err)
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const disconnect = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await walletService.disconnect()
      setConnected(false)
      setPublicKey(null)
      setBalance(0)
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to disconnect wallet"
      console.error("[v0] Failed to disconnect wallet:", err)
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshBalance = useCallback(async () => {
    if (!publicKey && !walletService.getPublicKey()) {
      return
    }

    setLoading(true)
    setError(null)
    try {
      // Mock implementation - in production this would connect to Solana RPC
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const mockBalance = Math.random() * 10
      setBalance(mockBalance)
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to refresh balance"
      console.error("[v0] Failed to refresh balance:", err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [publicKey])

  const requestAirdrop = useCallback(
    async (amount: number) => {
      const key = publicKey || walletService.getPublicKey()
      if (!key) {
        throw new Error("Wallet not connected")
      }
      if (amount <= 0 || amount > 5) {
        throw new Error("Invalid airdrop amount (must be between 0 and 5 SOL)")
      }

      setLoading(true)
      setError(null)
      try {
        // Mock implementation
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setBalance((prev) => prev + amount)
        return "mock_signature_" + Date.now()
      } catch (err: any) {
        const errorMessage = err?.message || "Airdrop failed"
        console.error("[v0] Airdrop failed:", err)
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setLoading(false)
      }
    },
    [publicKey],
  )

  return {
    balance,
    network,
    loading,
    error,
    publicKey,
    connected,
    walletService,
    connect,
    disconnect,
    refreshBalance,
    requestAirdrop,
  }
}
