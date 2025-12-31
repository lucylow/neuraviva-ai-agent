"use client"

import { useEffect, useState } from "react"
import { CloudUpload, RefreshCw, CheckCircle, Clock } from "lucide-react"

const activityTypes = [
  { type: "upload", icon: CloudUpload, color: "text-primary" },
  { type: "processing", icon: RefreshCw, color: "text-accent" },
  { type: "verification", icon: CheckCircle, color: "text-green-500" },
  { type: "analysis", icon: Clock, color: "text-yellow-500" },
]

const descriptions = [
  "Uploaded Vina docking results for protein 1A2G",
  "Processing Glide simulation batch",
  "Verifying data integrity on Solana",
  "AI classification completed for kinase inhibitors",
  "Exporting CSV report for project Alpha",
]

export function LiveData() {
  const [activities, setActivities] = useState<any[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = {
        id: Date.now(),
        type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
        user: ["researcher_01", "lab_alpha", "team_beta"][Math.floor(Math.random() * 3)],
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        timestamp: new Date(),
        status: Math.random() > 0.1 ? "success" : "processing",
      }

      setActivities((prev) => [newActivity, ...prev.slice(0, 7)])
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-6">Live Data Feed</h2>
      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
        See real-time data processing and blockchain verification happening across our platform.
      </p>

      <div className="bg-gradient-to-br from-card to-secondary rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Live Data Feed</h3>
                <p className="text-sm text-muted-foreground">Real-time platform activity</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm text-muted-foreground">Connected</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-background/30">
          {[
            { value: "42", label: "Active Users" },
            { value: "1,284", label: "Today's Files" },
            { value: "99.7%", label: "Success Rate" },
            { value: "3.2s", label: "Avg. Processing" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="h-96 overflow-y-auto">
          {activities.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <RefreshCw className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
                <p className="text-muted-foreground">Connecting to live feed...</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {activities.map((item) => {
                const Icon = item.type.icon
                return (
                  <div key={item.id} className="p-4 hover:bg-background/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-background/50">
                        <Icon className={`h-4 w-4 ${item.type.color}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-foreground truncate">{item.description}</p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              item.status === "success"
                                ? "bg-green-500/20 text-green-500"
                                : "bg-primary/20 text-primary"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>by {item.user}</span>
                          <span>•</span>
                          <span>
                            {item.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t border-border bg-background/30">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Showing {activities.length} live activities</p>
            <button
              onClick={() => setActivities([])}
              className="text-xs text-primary hover:text-accent transition-colors"
            >
              Clear feed
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
