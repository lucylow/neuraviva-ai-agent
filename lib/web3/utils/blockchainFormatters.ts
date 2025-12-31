import type { PublicKey } from "@solana/web3.js"

export function formatAddress(address: string | PublicKey, length = 8): string {
  const str = typeof address === "string" ? address : address.toString()
  if (str.length <= length * 2) return str
  return `${str.slice(0, length)}...${str.slice(-length)}`
}

export function formatSOL(amount: number, decimals = 4): string {
  return amount.toFixed(decimals)
}

export function formatLamports(lamports: number): string {
  return (lamports / 1e9).toFixed(9)
}

export function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

  let interval = Math.floor(seconds / 31536000)
  if (interval >= 1) return `${interval}y ago`

  interval = Math.floor(seconds / 2592000)
  if (interval >= 1) return `${interval}mo ago`

  interval = Math.floor(seconds / 86400)
  if (interval >= 1) return `${interval}d ago`

  interval = Math.floor(seconds / 3600)
  if (interval >= 1) return `${interval}h ago`

  interval = Math.floor(seconds / 60)
  if (interval >= 1) return `${interval}m ago`

  return `${Math.floor(seconds)}s ago`
}

export function formatHash(hash: string, length = 16): string {
  if (hash.length <= length) return hash
  return `${hash.slice(0, length / 2)}...${hash.slice(-length / 2)}`
}

export function formatBytes(bytes: number): string {
  const units = ["B", "KB", "MB", "GB", "TB"]
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`
}
