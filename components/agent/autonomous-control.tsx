"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Zap, Clock, TrendingUp, AlertTriangle, CheckCircle2, Settings, Calendar, Lightbulb } from "lucide-react"
import { agentAPI } from "@/lib/agent-api"
import { useToast } from "@/hooks/use-toast"

export function AutonomousControl() {
  const [config, setConfig] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [insights, setInsights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [configData, tasksData, insightsData] = await Promise.all([
        agentAPI.getAutonomousConfig("user123"),
        agentAPI.getScheduledTasks("user123"),
        agentAPI.getProactiveInsights("user123"),
      ])

      setConfig(configData)
      setTasks(tasksData)
      setInsights(insightsData)
    } catch (error) {
      console.error("Failed to load autonomous data:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateConfig = async (updates: any) => {
    try {
      const updatedConfig = { ...config, ...updates }
      await agentAPI.updateAutonomousConfig("user123", updatedConfig)
      setConfig(updatedConfig)
      toast({ title: "Configuration updated", description: "Autonomous settings have been saved." })
    } catch (error) {
      toast({ title: "Update failed", description: "Failed to update configuration.", variant: "destructive" })
    }
  }

  const executeInsight = async (insightId: string) => {
    try {
      await agentAPI.executeInsightAction(insightId, "user123")
      toast({ title: "Action executed", description: "The suggested action has been performed." })
      loadData()
    } catch (error) {
      toast({ title: "Execution failed", description: "Failed to execute action.", variant: "destructive" })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 flex items-center justify-center">
          <Clock className="h-5 w-5 animate-spin mr-2" />
          Loading autonomous features...
        </CardContent>
      </Card>
    )
  }

  const insightIcons = {
    opportunity: Lightbulb,
    warning: AlertTriangle,
    anomaly: AlertTriangle,
    recommendation: TrendingUp,
  }

  const insightColors = {
    opportunity: "text-green-500 bg-green-50",
    warning: "text-yellow-600 bg-yellow-50",
    anomaly: "text-orange-600 bg-orange-50",
    recommendation: "text-blue-500 bg-blue-50",
  }

  return (
    <Tabs defaultValue="config" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="config">
          <Settings className="h-4 w-4 mr-2" />
          Agent Configuration
        </TabsTrigger>
        <TabsTrigger value="insights">
          <Lightbulb className="h-4 w-4 mr-2" />
          Insights ({insights.length})
        </TabsTrigger>
        <TabsTrigger value="tasks">
          <Calendar className="h-4 w-4 mr-2" />
          Scheduled Tasks ({tasks.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="config" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Agent Autonomy Level
            </CardTitle>
            <CardDescription>Control how independently the NeuraViva AI Agent can operate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Current Mode</Label>
              <div className="flex gap-2">
                {["supervised", "semi-autonomous", "fully-autonomous"].map((level) => (
                  <Button
                    key={level}
                    variant={config?.autonomyLevel === level ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateConfig({ autonomyLevel: level })}
                  >
                    {level === "supervised" && "Supervised"}
                    {level === "semi-autonomous" && "Semi-Autonomous"}
                    {level === "fully-autonomous" && "Fully Autonomous"}
                  </Button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Learning Enabled</Label>
                  <p className="text-xs text-muted-foreground">Agent learns from your feedback</p>
                </div>
                <Switch
                  checked={config?.learningEnabled}
                  onCheckedChange={(checked) => updateConfig({ learningEnabled: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Proactive Monitoring</Label>
                  <p className="text-xs text-muted-foreground">Continuous system analysis</p>
                </div>
                <Switch
                  checked={config?.proactiveMonitoring}
                  onCheckedChange={(checked) => updateConfig({ proactiveMonitoring: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Task Scheduling</Label>
                  <p className="text-xs text-muted-foreground">Automatic task execution</p>
                </div>
                <Switch
                  checked={config?.taskScheduling}
                  onCheckedChange={(checked) => updateConfig({ taskScheduling: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Self-Improvement</Label>
                  <p className="text-xs text-muted-foreground">Optimize performance over time</p>
                </div>
                <Switch
                  checked={config?.selfImprovement}
                  onCheckedChange={(checked) => updateConfig({ selfImprovement: checked })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Auto-Execute Thresholds</CardTitle>
            <CardDescription>Which impact levels can be executed automatically</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {["low", "medium", "high", "critical"].map((level) => (
              <div key={level} className="flex items-center justify-between">
                <div>
                  <Label className="capitalize">{level} Impact Actions</Label>
                </div>
                <Switch
                  checked={config?.autoExecuteThreshold?.[level]}
                  onCheckedChange={(checked) =>
                    updateConfig({
                      autoExecuteThreshold: {
                        ...config?.autoExecuteThreshold,
                        [level]: checked,
                      },
                    })
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="insights" className="space-y-4">
        {insights.map((insight) => {
          const Icon = insightIcons[insight.type as keyof typeof insightIcons]
          const colorClass = insightColors[insight.type as keyof typeof insightColors]

          return (
            <Card key={insight.id} className="border-2">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`rounded-lg p-2 ${colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm">{insight.title}</h4>
                      <Badge variant="outline" className={colorClass}>
                        {insight.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <TrendingUp className="h-3 w-3" />
                      <span>Confidence: {(insight.confidence * 100).toFixed(0)}%</span>
                    </div>
                    {insight.actionable && (
                      <div className="flex gap-2">
                        {insight.suggestedAction?.autoExecutable && (
                          <Button size="sm" onClick={() => executeInsight(insight.id)}>
                            <Zap className="h-4 w-4 mr-2" />
                            Execute Action
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => agentAPI.acknowledgeInsight(insight.id, "user123")}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Acknowledge
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </TabsContent>

      <TabsContent value="tasks" className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-sm capitalize">{task.action.replace(/_/g, " ")}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Frequency: {task.schedule.frequency} • Executed {task.executedCount} times
                  </p>
                </div>
                <Badge variant={task.status === "pending" ? "secondary" : "default"}>{task.status}</Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Next: {new Date(task.schedule.nextRun).toLocaleDateString()}</span>
                </div>
                {task.schedule.lastRun && (
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Last: {new Date(task.schedule.lastRun).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>
    </Tabs>
  )
}
