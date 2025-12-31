"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Brain, Database, TrendingUp } from "lucide-react"

export function AgentStats() {
  const stats = [
    {
      title: "Queries Processed",
      value: "1,247",
      change: "+12.5%",
      icon: Brain,
      color: "text-purple-500",
    },
    {
      title: "Data Points Analyzed",
      value: "45.2K",
      change: "+8.3%",
      icon: Database,
      color: "text-blue-500",
    },
    {
      title: "Insights Generated",
      value: "892",
      change: "+15.7%",
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      title: "Active Sessions",
      value: "23",
      change: "+4",
      icon: Activity,
      color: "text-orange-500",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change} from last month</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
