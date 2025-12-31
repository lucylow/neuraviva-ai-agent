"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  HomeIcon,
  MagnifyingGlassIcon,
  CloudArrowUpIcon,
  FolderIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  CubeIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline"
import WalletConnector from "@/components/web3/wallet-connector"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Data Explorer", href: "/explorer", icon: MagnifyingGlassIcon },
  { name: "Upload", href: "/upload", icon: CloudArrowUpIcon },
  { name: "Projects", href: "/projects", icon: FolderIcon },
  { name: "Analytics", href: "/analytics", icon: ChartBarIcon },
  { name: "Blockchain", href: "/blockchain", icon: CubeIcon },
  { name: "AI Data Agent", href: "/agent", icon: SparklesIcon },
  { name: "Settings", href: "/settings", icon: Cog6ToothIcon },
]

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="relative z-50 lg:hidden animate-fade-in">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-0 flex">
            <div className="relative mr-16 flex w-full max-w-xs flex-1 animate-slide-in">
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="-m-2.5 p-2.5 text-foreground hover:text-primary transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card px-6 pb-4 shadow-xl border-r border-border">
                <div className="flex h-20 shrink-0 items-center gap-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-primary-foreground font-bold text-xl font-mono">NV</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-foreground">NeuraViva</span>
                    <span className="text-xs font-medium text-muted-foreground">AI Platform</span>
                  </div>
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul className="flex flex-1 flex-col gap-y-2">
                    <li>
                      <ul className="space-y-1">
                        {navigation.map((item) => {
                          const isActive = pathname === item.href
                          return (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                className={`
                                  group flex gap-x-3 rounded-lg p-3 text-sm font-semibold leading-6 transition-all duration-200
                                  ${
                                    isActive
                                      ? "bg-gradient-to-r from-primary/10 to-accent/10 text-primary shadow-sm border border-primary/20"
                                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                  }
                                `}
                              >
                                <item.icon
                                  className={`h-5 w-5 shrink-0 transition-transform duration-200 ${isActive ? "text-primary" : "group-hover:scale-110"}`}
                                />
                                {item.name}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card px-6 pb-4 border-r border-border">
          <div className="flex h-20 shrink-0 items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-bold text-xl font-mono">NV</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground">NeuraViva</span>
              <span className="text-xs font-medium text-muted-foreground">AI Platform</span>
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-2">
              <li>
                <ul className="space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`
                            group flex gap-x-3 rounded-lg p-3 text-sm font-semibold leading-6 transition-all duration-200
                            ${
                              isActive
                                ? "bg-gradient-to-r from-primary/10 to-accent/10 text-primary shadow-sm border border-primary/20"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            }
                          `}
                        >
                          <item.icon
                            className={`h-5 w-5 shrink-0 transition-transform duration-200 ${isActive ? "text-primary" : "group-hover:scale-110"}`}
                          />
                          {item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-foreground hover:text-primary lg:hidden transition-colors"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <WalletConnector compact />
              <Link
                href="/"
                className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                Back to Landing
              </Link>
            </div>
          </div>
        </div>

        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
