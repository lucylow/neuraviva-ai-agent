"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileSearch, BarChart3, FileText, Upload } from "lucide-react"
import { agentAPI } from "@/lib/agent-api"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function QuickActions() {
  const [loading, setLoading] = useState<string | null>(null)
  const { toast } = useToast()

  const actions = [
    {
      id: "search",
      title: "Search Data",
      description: "Find specific docking results",
      icon: FileSearch,
      color: "bg-blue-500",
      action: async () => {
        setLoading("search")
        try {
          await agentAPI.sendMessage("Show me recent docking results", "user123")
          toast({
            title: "Search completed",
            description: "Check the chat for results",
          })
        } catch (error) {
          toast({
            title: "Search failed",
            description: "Please try again",
            variant: "destructive",
          })
        } finally {
          setLoading(null)
        }
      },
    },
    {
      id: "analyze",
      title: "Analyze Data",
      description: "Get insights from your data",
      icon: BarChart3,
      color: "bg-green-500",
      action: async () => {
        setLoading("analyze")
        try {
          await agentAPI.analyzeData(["data1", "data2"], "user123")
          toast({
            title: "Analysis started",
            description: "Results will appear in chat",
          })
        } catch (error) {
          toast({
            title: "Analysis failed",
            description: "Please try again",
            variant: "destructive",
          })
        } finally {
          setLoading(null)
        }
      },
    },
    {
      id: "report",
      title: "Generate Report",
      description: "Create a detailed report",
      icon: FileText,
      color: "bg-purple-500",
      action: async () => {
        setLoading("report")
        try {
          await agentAPI.generateReport([], "user123")
          toast({
            title: "Report generated",
            description: "Check your documents folder",
          })
        } catch (error) {
          toast({
            title: "Report generation failed",
            description: "Please try again",
            variant: "destructive",
          })
        } finally {
          setLoading(null)
        }
      },
    },
    {
      id: "upload",
      title: "Upload Data",
      description: "Process new docking files",
      icon: Upload,
      color: "bg-orange-500",
      action: () => {
        window.location.href = "/upload"
      },
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks you can perform with the AI agent</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Button
              key={action.id}
              variant="outline"
              className="h-auto flex-col items-start gap-2 p-4 bg-transparent"
              onClick={action.action}
              disabled={loading === action.id}
            >
              <div className="flex items-center gap-2 w-full">
                <div className={`p-2 rounded-lg ${action.color}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </div>
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}
