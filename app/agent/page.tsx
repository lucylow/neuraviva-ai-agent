import { AppLayout } from "@/components/layout/app-layout"
import { AIChat } from "@/components/agent/ai-chat"
import { AgentStats } from "@/components/agent/agent-stats"
import { QuickActions } from "@/components/agent/quick-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Database, FileSearch, TrendingUp, Shield, Zap } from "lucide-react"
import { ConversationHistory } from "@/components/agent/conversation-history"
import { AutonomousControl } from "@/components/agent/autonomous-control"

export default function AgentPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">NeuraViva Data Management AI Agent</h1>
          <p className="text-muted-foreground">
            Intelligent autonomous assistant for molecular docking data management, analysis, and curation
          </p>
        </div>

        <AgentStats />

        <AutonomousControl />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <AIChat />
            <ConversationHistory />
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Capabilities</CardTitle>
                <CardDescription>What the AI agent can do for you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <FileSearch className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Natural Language Search</p>
                    <p className="text-xs text-muted-foreground">Query your data using plain English</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Predictive Analytics</p>
                    <p className="text-xs text-muted-foreground">Identify trends and predict outcomes</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">AI Classification</p>
                    <p className="text-xs text-muted-foreground">Automatic categorization and tagging</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Database className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Data Management</p>
                    <p className="text-xs text-muted-foreground">Organize and curate research data</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Blockchain Verification</p>
                    <p className="text-xs text-muted-foreground">Verify data integrity and provenance</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Real-time Insights</p>
                    <p className="text-xs text-muted-foreground">Instant analysis and recommendations</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Agent Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Status</span>
                  <Badge variant="default" className="bg-green-500">
                    Online
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Model</span>
                  <span className="text-sm text-muted-foreground">Gemini Pro</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Memory</span>
                  <span className="text-sm text-muted-foreground">Vector DB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Confidence</span>
                  <span className="text-sm text-muted-foreground">92%</span>
                </div>
              </CardContent>
            </Card>

            <QuickActions />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Example Queries</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-2 bg-muted rounded-md text-xs">
                  "Show me all kinase docking results with affinity below -8"
                </div>
                <div className="p-2 bg-muted rounded-md text-xs">
                  "Analyze binding patterns for EGFR family proteins"
                </div>
                <div className="p-2 bg-muted rounded-md text-xs">"Generate a report on recent oncology targets"</div>
                <div className="p-2 bg-muted rounded-md text-xs">
                  "What are the trends in simulation runtime over the past month?"
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
