declare global {
  interface Window {
    solana?: any
    phantom?: {
      solana?: any
    }
  }
}

export interface PhantomProvider {
  isPhantom?: boolean
  publicKey?: { toBase58: () => string }
  isConnected: boolean
  connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toBase58: () => string } }>
  disconnect: () => Promise<void>
  signMessage?: (message: Uint8Array, encoding?: string) => Promise<{ signature: Uint8Array }>
  signTransaction?: (transaction: any) => Promise<any>
  on: (event: string, handler: (...args: any[]) => void) => void
  off: (event: string, handler: (...args: any[]) => void) => void
}

export const getPhantomProvider = (): PhantomProvider | null => {
  if (typeof window === "undefined") return null

  if (window.phantom?.solana?.isPhantom) {
    return window.phantom.solana
  }

  if (window.solana?.isPhantom) {
    return window.solana
  }

  return null
}

export const detectPhantom = (): boolean => {
  return !!getPhantomProvider()
}

export const openPhantomDownload = () => {
  window.open("https://phantom.app/", "_blank")
}

export class PhantomWalletService {
  private provider: PhantomProvider | null = null
  private connected = false

  constructor() {
    if (typeof window !== "undefined") {
      this.provider = getPhantomProvider()
    }
  }

  isAvailable(): boolean {
    return !!this.provider
  }

  async connect(): Promise<string> {
    if (!this.provider) {
      throw new Error("Phantom wallet is not installed")
    }

    try {
      const response = await this.provider.connect()
      this.connected = true
      return response.publicKey.toBase58()
    } catch (error: any) {
      console.error("[v0] Failed to connect to Phantom:", error)
      if (error.code === 4001) {
        throw new Error("User rejected the connection request")
      }
      throw new Error(error.message || "Failed to connect to Phantom wallet")
    }
  }

  async disconnect(): Promise<void> {
    if (!this.provider) return

    try {
      await this.provider.disconnect()
      this.connected = false
    } catch (error: any) {
      console.error("[v0] Failed to disconnect from Phantom:", error)
      throw new Error(error.message || "Failed to disconnect from Phantom wallet")
    }
  }

  getPublicKey(): string | null {
    if (!this.provider?.publicKey) return null
    return this.provider.publicKey.toBase58()
  }

  isConnected(): boolean {
    return this.connected && !!this.provider?.isConnected
  }

  onAccountChange(callback: (publicKey: string | null) => void) {
    if (!this.provider) return

    const handler = (publicKey: any) => {
      callback(publicKey ? publicKey.toBase58() : null)
    }

    this.provider.on("accountChanged", handler)
    return () => this.provider?.off("accountChanged", handler)
  }

  onDisconnect(callback: () => void) {
    if (!this.provider) return

    this.provider.on("disconnect", callback)
    return () => this.provider?.off("disconnect", callback)
  }
}
