import type { PublicKey } from "@solana/web3.js"

export interface WalletState {
  connected: boolean
  connecting: boolean
  publicKey: PublicKey | null
  walletName: string | null
  balance: number
  network: "mainnet-beta" | "devnet" | "testnet"
  error: string | null
}

export interface TransactionDetails {
  signature: string
  timestamp: Date
  status: "confirmed" | "failed" | "pending"
  block: number
  fee: number
  instructions: any[]
  metadata?: {
    type: "data_registration" | "data_verification" | "nft_mint" | "transfer"
    dataId?: string
    dataHash?: string
    cid?: string
  }
}

export interface DataNFT {
  mint: PublicKey
  name: string
  symbol: string
  uri: string
  cid: string
  dataHash: string
  creator: PublicKey
  created: Date
  verified: boolean
  attributes?: {
    protein: string
    ligand: string
    affinity: number
    program: string
  }
}

export interface VerificationResult {
  verified: boolean
  onChainHash: string
  computedHash: string
  match: boolean
  transaction: string
  timestamp: Date
  block: number
}

export interface TokenBalance {
  mint: PublicKey
  symbol: string
  name: string
  balance: number
  decimals: number
  uiAmount: number
  logo?: string
}

export interface NetworkStatus {
  network: string
  blockHeight: number
  slot: number
  epoch: number
  transactionCount: number
  tps: number
  status: "healthy" | "degraded" | "down"
}
