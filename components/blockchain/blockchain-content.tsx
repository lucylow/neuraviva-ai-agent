"use client"

import { useState } from "react"
import { Cable as Cube, ShieldCheck, Wallet, BarChart3 } from "lucide-react"
import WalletConnector from "@/components/web3/wallet-connector"
import TransactionViewer from "@/components/web3/transaction-viewer"
import VerificationPanel from "@/components/web3/verification-panel"
import TokenBalance from "@/components/web3/token-balance"
import NetworkSwitcher from "@/components/web3/network-switcher"
import { useWalletConnection } from "@/lib/web3/hooks/useWalletConnection"

export default function BlockchainContent() {
  const { balance, network, publicKey, connected } = useWalletConnection()
  const [activeTab, setActiveTab] = useState<"transactions" | "verification" | "tokens">("transactions")

  const demoDataId = "demo_data_123"
  const demoHash = "a1b2c3d4e5f678901234567890123456789012345678901234567890123456"
  const demoCid = "QmXyZ1234567890ABCDEF"

  const tabs = [
    { id: "transactions", name: "Transactions", icon: BarChart3 },
    { id: "verification", name: "Verification", icon: ShieldCheck },
    { id: "tokens", name: "Tokens", icon: Wallet },
  ]

  if (!connected) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center">
          <div className="h-16 w-16 mx-auto mb-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center">
            <Cube className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Connect Your Phantom Wallet</h1>
          <p className="text-lg text-gray-600 mb-8">
            Connect your Phantom wallet to view blockchain transactions, verify data integrity, and manage your tokens
            on Solana.
          </p>
          <div className="inline-block">
            <WalletConnector />
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
              <ShieldCheck className="h-8 w-8 text-purple-600 mb-3 mx-auto" />
              <h3 className="font-semibold text-gray-900 mb-2">Data Verification</h3>
              <p className="text-sm text-gray-600">Verify docking data integrity on Solana blockchain</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
              <BarChart3 className="h-8 w-8 text-purple-600 mb-3 mx-auto" />
              <h3 className="font-semibold text-gray-900 mb-2">Transaction History</h3>
              <p className="text-sm text-gray-600">View all your blockchain transactions</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
              <Wallet className="h-8 w-8 text-purple-600 mb-3 mx-auto" />
              <h3 className="font-semibold text-gray-900 mb-2">Token Management</h3>
              <p className="text-sm text-gray-600">Manage SOL and data NFT tokens</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">Blockchain Dashboard</h1>
          <p className="mt-2 text-sm text-gray-500">Manage your Phantom wallet, transactions, and data verification</p>
        </div>
        <div className="flex items-center gap-4">
          <NetworkSwitcher />
          <WalletConnector compact />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Wallet Balance</p>
              <p className="text-2xl font-bold text-gray-900">{balance.toFixed(4)} SOL</p>
            </div>
            <Wallet className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Network</p>
              <p className="text-2xl font-bold text-gray-900 capitalize">{network}</p>
            </div>
            <Cube className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Connected Wallet</p>
              <p className="text-lg font-bold text-gray-900 truncate">{publicKey?.slice(0, 16) || ""}...</p>
            </div>
            <ShieldCheck className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                inline-flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors
                ${
                  activeTab === tab.id
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }
              `}
            >
              <tab.icon className="h-5 w-5" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {activeTab === "transactions" && (
          <div className="space-y-6">
            <TransactionViewer address={publicKey} limit={20} showDetails={true} />
          </div>
        )}

        {activeTab === "verification" && (
          <div className="space-y-6">
            <VerificationPanel
              dataId={demoDataId}
              dataHash={demoHash}
              cid={demoCid}
              onVerified={(result) => console.log("Verified:", result)}
            />
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How Blockchain Verification Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                  <div className="text-sm font-medium text-gray-900 mb-2">1. Data Hash</div>
                  <p className="text-sm text-gray-600">
                    A unique cryptographic hash is computed from your docking data
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <div className="text-sm font-medium text-gray-900 mb-2">2. Blockchain Storage</div>
                  <p className="text-sm text-gray-600">
                    The hash is stored on Solana blockchain as an immutable record
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                  <div className="text-sm font-medium text-gray-900 mb-2">3. Integrity Check</div>
                  <p className="text-sm text-gray-600">
                    Recompute hash and compare with blockchain record to verify integrity
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tokens" && (
          <div className="space-y-6">
            <TokenBalance showAll={true} />
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data NFTs</h3>
              <p className="text-gray-600 mb-6">
                Each docking dataset you register creates a unique Data NFT on Solana blockchain. These NFTs represent
                ownership and verification of your scientific data.
              </p>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all">
                View Data NFTs →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
