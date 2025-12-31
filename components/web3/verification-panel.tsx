"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ShieldCheck, AlertTriangle, CheckCircle, XCircle, RefreshCw, Copy, ExternalLink } from "lucide-react"
import { useBlockchainVerification } from "@/lib/web3/hooks/useBlockchainVerification"
import { formatAddress, formatHash } from "@/lib/web3/utils/blockchainFormatters"

interface VerificationPanelProps {
  dataId: string
  dataHash: string
  cid: string
  onVerified?: (result: any) => void
  className?: string
}

export default function VerificationPanel({
  dataId,
  dataHash,
  cid,
  onVerified,
  className = "",
}: VerificationPanelProps) {
  const { verifyData, verificationResult, loading, error, isDataRegistered } = useBlockchainVerification()
  const [isVerified, setIsVerified] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    checkInitialVerification()
  }, [dataId])

  const checkInitialVerification = async () => {
    const registered = await isDataRegistered(dataId)
    setIsVerified(registered)
  }

  const handleVerify = async () => {
    try {
      const result = await verifyData(dataId, dataHash)
      setIsVerified(result.verified)

      if (onVerified) {
        onVerified(result)
      }
    } catch (error) {
      console.error("Verification failed:", error)
    }
  }

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash)
  }

  const openExplorer = (signature: string) => {
    window.open(`https://explorer.solana.com/tx/${signature}`, "_blank")
  }

  const openIPFS = (cid: string) => {
    window.open(`https://ipfs.io/ipfs/${cid}`, "_blank")
  }

  return (
    <div className={`bg-white rounded-xl shadow ${className}`}>
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isVerified ? "bg-green-100" : "bg-gray-100"}`}>
              <ShieldCheck className={`h-6 w-6 ${isVerified ? "text-green-600" : "text-gray-400"}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Blockchain Verification</h3>
              <p className="text-sm text-gray-500">Verify data integrity on-chain</p>
            </div>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-purple-600 hover:text-purple-700"
          >
            {showDetails ? "Hide" : "Show"} Details
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Data ID</div>
            <div className="font-mono text-sm text-gray-900 flex items-center justify-between">
              <span className="truncate">{dataId}</span>
              <button onClick={() => copyHash(dataId)} className="ml-2 text-gray-400 hover:text-gray-600">
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">IPFS CID</div>
            <div className="font-mono text-sm text-gray-900 flex items-center justify-between">
              <span className="truncate">{formatHash(cid)}</span>
              <button onClick={() => openIPFS(cid)} className="ml-2 text-gray-400 hover:text-gray-600">
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500 mb-2">Data Hash (SHA-256)</div>
            <div className="font-mono text-xs text-gray-900 break-all">{dataHash}</div>
          </div>
        )}

        {verificationResult && (
          <div
            className={`p-4 rounded-lg border-2 ${
              verificationResult.match ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-start gap-3">
              {verificationResult.match ? (
                <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="font-semibold text-gray-900 mb-1">
                  {verificationResult.match ? "Verification Successful" : "Verification Failed"}
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  {verificationResult.match
                    ? "Data hash matches blockchain record. Data integrity confirmed."
                    : "Data hash does not match blockchain record. Data may have been modified."}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Transaction</span>
                    <button
                      onClick={() => openExplorer(verificationResult.transaction)}
                      className="font-mono text-purple-600 hover:text-purple-700 flex items-center gap-1"
                    >
                      {formatAddress(verificationResult.transaction)}
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Block</span>
                    <span className="font-mono">{verificationResult.block.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Timestamp</span>
                    <span>{verificationResult.timestamp.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={handleVerify}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4 mr-2" />
                Verify on Blockchain
              </>
            )}
          </Button>
          {verificationResult && (
            <Button onClick={() => openExplorer(verificationResult.transaction)} variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Transaction
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
