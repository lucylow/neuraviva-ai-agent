"use client"

import { useEffect, useMemo } from "react"
import { useDataStore } from "@/lib/store"
import { BarChartBigIcon as ChartBarIcon, TrendingUpIcon, PieChartIcon, ActivityIcon } from "lucide-react"

export function AnalyticsContent() {
  const { data, fetchData } = useDataStore()

  useEffect(() => {
    fetchData()
  }, [])

  const analytics = useMemo(() => {
    const affinityDistribution = {
      strong: data.filter((item) => item.binding.affinity < -8).length,
      moderate: data.filter((item) => item.binding.affinity >= -8 && item.binding.affinity < -6).length,
      weak: data.filter((item) => item.binding.affinity >= -6).length,
    }

    const proteinTargets = data.reduce(
      (acc, item) => {
        const protein = item.protein.name
        acc[protein] = (acc[protein] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const programUsage = data.reduce(
      (acc, item) => {
        const program = item.simulation.program
        acc[program] = (acc[program] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const therapeuticAreas = data.reduce(
      (acc, item) => {
        item.aiTags.therapeuticArea.forEach((area) => {
          acc[area] = (acc[area] || 0) + 1
        })
        return acc
      },
      {} as Record<string, number>,
    )

    const avgAffinity = data.length > 0 ? data.reduce((sum, item) => sum + item.binding.affinity, 0) / data.length : 0

    return {
      affinityDistribution,
      proteinTargets,
      programUsage,
      therapeuticAreas,
      avgAffinity,
    }
  }, [data])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-2 text-sm text-gray-500">
          Visualize and analyze your docking simulation data across {data.length} compounds
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium mb-1">Total Compounds</p>
              <p className="text-3xl font-bold text-blue-900">{data.length}</p>
            </div>
            <ChartBarIcon className="h-10 w-10 text-blue-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium mb-1">Strong Binders</p>
              <p className="text-3xl font-bold text-green-900">{analytics.affinityDistribution.strong}</p>
            </div>
            <TrendingUpIcon className="h-10 w-10 text-green-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium mb-1">Avg Affinity</p>
              <p className="text-3xl font-bold text-purple-900">{analytics.avgAffinity.toFixed(1)}</p>
            </div>
            <ActivityIcon className="h-10 w-10 text-purple-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium mb-1">Unique Targets</p>
              <p className="text-3xl font-bold text-yellow-900">{Object.keys(analytics.proteinTargets).length}</p>
            </div>
            <PieChartIcon className="h-10 w-10 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Binding Affinity Distribution */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Binding Affinity Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Strong (&lt; -8.0 kcal/mol)</span>
                  <span className="text-sm font-semibold text-green-600">{analytics.affinityDistribution.strong}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
                    style={{
                      width: `${data.length > 0 ? (analytics.affinityDistribution.strong / data.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Moderate (-6.0 to -8.0 kcal/mol)</span>
                  <span className="text-sm font-semibold text-yellow-600">
                    {analytics.affinityDistribution.moderate}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full"
                    style={{
                      width: `${data.length > 0 ? (analytics.affinityDistribution.moderate / data.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Weak (&gt; -6.0 kcal/mol)</span>
                  <span className="text-sm font-semibold text-red-600">{analytics.affinityDistribution.weak}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full"
                    style={{
                      width: `${data.length > 0 ? (analytics.affinityDistribution.weak / data.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Protein Target Distribution */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Protein Target Distribution</h3>
            <div className="space-y-3">
              {Object.entries(analytics.proteinTargets)
                .sort(([, a], [, b]) => b - a)
                .map(([protein, count]) => (
                  <div key={protein} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 truncate flex-1">{protein}</span>
                    <div className="flex items-center gap-2 ml-4">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                          style={{ width: `${(count / data.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Program Usage */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Docking Program Usage</h3>
            <div className="space-y-4">
              {Object.entries(analytics.programUsage)
                .sort(([, a], [, b]) => b - a)
                .map(([program, count], idx) => {
                  const colors = [
                    "from-blue-500 to-blue-600",
                    "from-green-500 to-green-600",
                    "from-purple-500 to-purple-600",
                    "from-orange-500 to-orange-600",
                  ]
                  return (
                    <div key={program}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 capitalize">{program}</span>
                        <span className="text-sm font-semibold text-gray-900">{count} compounds</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`bg-gradient-to-r ${colors[idx % colors.length]} h-3 rounded-full`}
                          style={{ width: `${(count / data.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>

        {/* Top Therapeutic Areas */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Therapeutic Areas</h3>
            <div className="space-y-3">
              {Object.entries(analytics.therapeuticAreas)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 6)
                .map(([area, count]) => (
                  <div key={area} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">{area}</span>
                    <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-800">
                      {count} compounds
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Data Quality Metrics */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Quality Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <p className="text-3xl font-bold text-green-900">
                {((data.filter((d) => d.metadata.validated).length / data.length) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-green-700 mt-2">Blockchain Verified</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <p className="text-3xl font-bold text-blue-900">
                {((data.filter((d) => d.aiTags.druggability === "high").length / data.length) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-blue-700 mt-2">High Druggability</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <p className="text-3xl font-bold text-purple-900">
                {(data.reduce((sum, d) => sum + d.aiTags.noveltyScore, 0) / data.length).toFixed(2)}
              </p>
              <p className="text-sm text-purple-700 mt-2">Avg Novelty Score</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
