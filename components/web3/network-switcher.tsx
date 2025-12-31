"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Globe, Check } from "lucide-react"

const networks = [
  { id: "mainnet-beta", name: "Mainnet Beta", color: "green" },
  { id: "devnet", name: "Devnet", color: "blue" },
  { id: "testnet", name: "Testnet", color: "yellow" },
]

export default function NetworkSwitcher() {
  const [currentNetwork, setCurrentNetwork] = useState("devnet")
  const [showMenu, setShowMenu] = useState(false)

  const currentNetworkData = networks.find((n) => n.id === currentNetwork)

  return (
    <div className="relative">
      <Button
        onClick={() => setShowMenu(!showMenu)}
        variant="outline"
        className="bg-white border-gray-200 hover:bg-gray-50"
      >
        <Globe className="h-4 w-4 mr-2" />
        <span className="capitalize">{currentNetworkData?.name}</span>
      </Button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-2">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Select Network</div>
            {networks.map((network) => (
              <button
                key={network.id}
                onClick={() => {
                  setCurrentNetwork(network.id)
                  setShowMenu(false)
                }}
                className={`
                  w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors
                  ${
                    currentNetwork === network.id
                      ? "bg-purple-50 text-purple-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      network.color === "green"
                        ? "bg-green-500"
                        : network.color === "blue"
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                    }`}
                  />
                  <span>{network.name}</span>
                </div>
                {currentNetwork === network.id && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
          <div className="border-t p-2">
            <div className="px-3 py-2 text-xs text-gray-500">
              {currentNetwork === "mainnet-beta" ? "Real SOL network" : "Test network for development"}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
