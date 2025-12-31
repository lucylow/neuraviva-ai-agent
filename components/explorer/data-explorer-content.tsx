"use client"

import { useState, useEffect } from "react"
import { FuelIcon as FunnelIcon, MailMinusIcon as MagnifyingGlassIcon, ShieldCheck, ExternalLink } from "lucide-react"
import { useDataStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function DataExplorerContent() {
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const { data, filters, setFilters, fetchData, loading } = useDataStore()

  useEffect(() => {
    fetchData()
  }, [])

  const handleProgramFilter = (program: string) => {
    const newFilters =
      program === "All Programs" ? { ...filters, program: undefined } : { ...filters, program: [program.toLowerCase()] }
    setFilters(newFilters)
    fetchData(newFilters)
  }

  const handleStrengthFilter = (strength: string) => {
    let newFilters = { ...filters }
    if (strength === "Strong (< -8.0)") {
      newFilters = { ...filters, maxAffinity: -8.0 }
    } else if (strength === "Moderate (-6.0 to -8.0)") {
      newFilters = { ...filters, minAffinity: -8.0, maxAffinity: -6.0 }
    } else if (strength === "Weak (> -6.0)") {
      newFilters = { ...filters, minAffinity: -6.0 }
    } else {
      delete newFilters.minAffinity
      delete newFilters.maxAffinity
    }
    setFilters(newFilters)
    fetchData(newFilters)
  }

  const filteredData = data.filter(
    (item) =>
      searchQuery === "" ||
      item.protein.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ligand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.protein.pdbId.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Explorer</h1>
          <p className="mt-2 text-sm text-gray-500">Browse and analyze all docking simulation results</p>
        </div>
        <div className="flex gap-3">
          <Link href="/blockchain">
            <Button variant="outline" className="bg-white">
              <ShieldCheck className="h-4 w-4 mr-2" />
              Verify Data
            </Button>
          </Link>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500"
          >
            <FunnelIcon className="h-5 w-5" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by protein, ligand, or PDB ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        />
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white shadow sm:rounded-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Program</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
              onChange={(e) => handleProgramFilter(e.target.value)}
            >
              <option>All Programs</option>
              <option>vina</option>
              <option>glide</option>
              <option>gromacs</option>
              <option>autodock</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Binding Strength</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
              onChange={(e) => handleStrengthFilter(e.target.value)}
            >
              <option>All Strengths</option>
              <option>Strong (&lt; -8.0)</option>
              <option>Moderate (-6.0 to -8.0)</option>
              <option>Weak (&gt; -6.0)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Verification Status</label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm">
              <option>All Status</option>
              <option>Verified</option>
              <option>Unverified</option>
            </select>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{filteredData.length} Results Found</h3>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
              <p className="mt-2 text-sm text-gray-500">Loading data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Protein (PDB)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ligand</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Affinity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Program</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blockchain</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                        No results found. Try adjusting your filters or upload new data.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 cursor-pointer">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.protein.name} ({item.protein.pdbId})
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.ligand.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                          <span
                            className={item.binding.affinity < -8 ? "text-green-600 font-semibold" : "text-gray-900"}
                          >
                            {item.binding.affinity.toFixed(1)} kcal/mol
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {item.simulation.program}
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {item.metadata.validated ? (
                            <Link
                              href="/blockchain"
                              className="text-purple-600 hover:text-purple-700 flex items-center gap-1"
                            >
                              <ShieldCheck className="h-4 w-4" />
                              <span>View</span>
                            </Link>
                          ) : (
                            <Link
                              href="/blockchain"
                              className="text-gray-400 hover:text-gray-600 flex items-center gap-1"
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span>Verify</span>
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
