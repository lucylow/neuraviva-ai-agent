"use client"

import type React from "react"
import { useEffect, useState } from "react"
import {
  DocumentDuplicateIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline"
import { useDataStore } from "@/lib/store"
import { Cable as Cube } from "lucide-react"
import Link from "next/link"

interface StatsCardProps {
  title: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  change: { value: string; direction: "up" | "down" }
  color: "blue" | "green" | "purple" | "yellow"
}

function StatsCard({ title, value, icon: Icon, change, color }: StatsCardProps) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    yellow: "bg-yellow-100 text-yellow-600",
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="text-2xl font-semibold text-gray-900">{value}</dd>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <span className={change.direction === "up" ? "text-green-600" : "text-red-600"}>
            {change.direction === "up" ? (
              <ArrowUpIcon className="inline h-4 w-4" />
            ) : (
              <ArrowDownIcon className="inline h-4 w-4" />
            )}{" "}
            {change.value}
          </span>{" "}
          <span className="text-gray-500">from last month</span>
        </div>
      </div>
    </div>
  )
}

export function DashboardContent() {
  const { data, stats, activities, fetchData, fetchStats, setUseMockData } = useDataStore()
  const [blockchainStats, setBlockchainStats] = useState({
    verifiedData: 0,
    pendingVerification: 0,
    totalTransactions: 0,
  })

  useEffect(() => {
    setUseMockData(true)
    fetchData()
    fetchStats()
  }, [])

  useEffect(() => {
    const verified = data.filter((item) => item.metadata.validated).length
    const pending = data.length - verified
    setBlockchainStats({
      verifiedData: verified,
      pendingVerification: pending,
      totalTransactions: verified + 42,
    })
  }, [data])

  const recentData = data.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Data Points"
          value={stats?.totalDataPoints?.toLocaleString() || "0"}
          icon={DocumentDuplicateIcon}
          change={{ value: "+12.5%", direction: "up" }}
          color="blue"
        />
        <StatsCard
          title="Blockchain Entries"
          value={stats?.blockchainEntries?.toLocaleString() || "0"}
          icon={ShieldCheckIcon}
          change={{ value: "+8.2%", direction: "up" }}
          color="green"
        />
        <StatsCard
          title="Storage Used"
          value={stats?.storageUsed || "0 GB"}
          icon={ChartBarIcon}
          change={{ value: "+4.7%", direction: "up" }}
          color="purple"
        />
        <StatsCard
          title="Processing Queue"
          value={stats?.processingQueue?.toString() || "0"}
          icon={ClockIcon}
          change={{ value: "-2.1%", direction: "down" }}
          color="yellow"
        />
      </div>

      {/* Blockchain Verification Panel */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow-lg border border-purple-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
              <Cube className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Blockchain Verification</h3>
              <p className="text-sm text-gray-600">Data integrity secured on Solana</p>
            </div>
          </div>
          <Link
            href="/blockchain"
            className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1"
          >
            View Details →
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="text-2xl font-bold text-gray-900">{blockchainStats.verifiedData}</div>
            <div className="text-sm text-gray-600 mt-1">Verified on Chain</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="text-2xl font-bold text-gray-900">{blockchainStats.pendingVerification}</div>
            <div className="text-sm text-gray-600 mt-1">Pending Verification</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="text-2xl font-bold text-gray-900">{blockchainStats.totalTransactions}</div>
            <div className="text-sm text-gray-600 mt-1">Total Transactions</div>
          </div>
        </div>
      </div>

      {/* Recent Data */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Docking Results</h3>
            <a href="/explorer" className="text-sm font-medium text-purple-600 hover:text-purple-500">
              View all →
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Protein
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ligand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Affinity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No data available. Upload your first docking result to get started.
                    </td>
                  </tr>
                ) : (
                  recentData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.protein.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.ligand.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                        {item.binding.affinity.toFixed(1)} kcal/mol
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.simulation.timestamp).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.metadata.validated ? (
                          <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-yellow-100 px-2 text-xs font-semibold leading-5 text-yellow-800">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="flow-root">
            <ul className="-mb-8">
              {activities.slice(0, 5).map((activity, activityIdx) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {activityIdx !== activities.length - 1 ? (
                      <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center ring-8 ring-white">
                          <DocumentDuplicateIcon className="h-5 w-5 text-purple-600" />
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm text-gray-500">{activity.description}</p>
                        </div>
                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
