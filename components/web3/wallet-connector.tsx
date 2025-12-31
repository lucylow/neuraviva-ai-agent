"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ExternalLink, Copy, AlertTriangle, Download } from "lucide-react"
import { useWalletConnection } from "@/lib/web3/hooks/useWalletConnection"
import { formatAddress, formatSOL } from "@/lib/web3/utils/blockchainFormatters"
import { openPhantomDownload } from "@/lib/web3/phantom"

interface WalletConnectorProps {
  compact?: boolean
  showBalance?: boolean
  onConnect?: (publicKey: string) => void
  onDisconnect?: () => void
  className?: string
}

export default function WalletConnector({
  compact = false,
  showBalance = true,
  onConnect,
  onDisconnect,
  className = "",
}: WalletConnectorProps) {
  const {
    balance,
    network,
    loading,
    publicKey,
    connected,
    walletService,
    connect,
    disconnect,
    refreshBalance,
    requestAirdrop,
  } = useWalletConnection()
  const [showDetails, setShowDetails] = useState(false)
  const [showAirdropModal, setShowAirdropModal] = useState(false)
  const [airdropLoading, setAirdropLoading] = useState(false)
  const [isPhantomInstalled, setIsPhantomInstalled] = useState(false)

  useEffect(() => {
    setIsPhantomInstalled(walletService.isAvailable())
  }, [])

  const handleConnect = async () => {
    try {
      if (!isPhantomInstalled) {
        const shouldDownload = confirm("Phantom wallet is not installed. Would you like to download it?")
        if (shouldDownload) {
          openPhantomDownload()
        }
        return
      }

      const key = await connect()
      onConnect?.(key)
    } catch (error: any) {
      console.error("[v0] Failed to connect wallet:", error)
      alert(error.message || "Failed to connect wallet. Please try again.")
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
      setShowDetails(false)
      onDisconnect?.()
    } catch (error: any) {
      console.error("[v0] Error disconnecting:", error)
      alert(error.message || "Failed to disconnect wallet.")
    }
  }

  const handleAirdrop = async () => {
    setAirdropLoading(true)
    try {
      await requestAirdrop(1)
      alert("Airdrop successful! 1 SOL added to your wallet.")
    } catch (error: any) {
      console.error("[v0] Airdrop failed:", error)
      alert(`Airdrop failed: ${error.message || "Please try again later"}`)
    } finally {
      setAirdropLoading(false)
      setShowAirdropModal(false)
    }
  }

  const copyAddress = () => {
    try {
      if (!publicKey) return
      navigator.clipboard.writeText(publicKey)
      alert("Address copied to clipboard!")
    } catch (error) {
      console.error("[v0] Failed to copy address:", error)
    }
  }

  const openExplorer = () => {
    if (!publicKey) return
    window.open(`https://explorer.solana.com/address/${publicKey}?cluster=${network}`, "_blank")
  }

  if (!isPhantomInstalled) {
    return (
      <Button
        onClick={handleConnect}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
      >
        <Download className="h-4 w-4 mr-2" />
        Install Phantom
      </Button>
    )
  }

  if (!connected) {
    return (
      <Button
        onClick={handleConnect}
        disabled={loading}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
      >
        {loading ? "Connecting..." : "Connect Phantom"}
      </Button>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg px-4 py-2 hover:from-purple-700 hover:to-blue-700 transition-all"
      >
        <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
        <span className="font-medium">{showBalance ? `${formatSOL(balance)} SOL` : "Connected"}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${showDetails ? "rotate-180" : ""}`} />
      </button>

      {showDetails && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-700">Connected to Phantom</span>
              </div>
              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">{network}</span>
            </div>
          </div>

          <div className="p-4">
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-1">Wallet Address</div>
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono text-gray-800 truncate">{formatAddress(publicKey || "")}</code>
                <div className="flex gap-1">
                  <button onClick={copyAddress} className="p-1 text-gray-400 hover:text-gray-600" title="Copy address">
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={openExplorer}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="View in explorer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-gray-500">Balance</div>
                <button
                  onClick={refreshBalance}
                  disabled={loading}
                  className="text-xs text-purple-600 hover:text-purple-700 disabled:opacity-50"
                >
                  {loading ? "Refreshing..." : "Refresh"}
                </button>
              </div>
              <div className="text-2xl font-bold text-gray-900">{formatSOL(balance)} SOL</div>
              {balance < 0.01 && network === "devnet" && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div className="text-xs text-yellow-700">Low balance. Get test SOL for devnet.</div>
                  </div>
                  <button
                    onClick={() => setShowAirdropModal(true)}
                    disabled={airdropLoading}
                    className="mt-2 w-full text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded hover:bg-yellow-200 disabled:opacity-50"
                  >
                    {airdropLoading ? "Requesting..." : "Get Test SOL"}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Button onClick={openExplorer} variant="outline" className="w-full bg-transparent">
                <ExternalLink className="h-4 w-4 mr-2" />
                View in Explorer
              </Button>
              <Button onClick={handleDisconnect} variant="destructive" className="w-full" disabled={loading}>
                {loading ? "Disconnecting..." : "Disconnect"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showAirdropModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Test SOL</h3>
            <p className="text-sm text-gray-600 mb-6">
              Request 1 SOL on devnet for testing. This is free test currency and has no real value.
            </p>
            <div className="flex gap-3">
              <Button onClick={() => setShowAirdropModal(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleAirdrop} disabled={airdropLoading} className="flex-1">
                {airdropLoading ? "Requesting..." : "Request 1 SOL"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
