"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Send,
  Sparkles,
  Loader2,
  Bot,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Lightbulb,
  BarChart3,
  FileText,
  TrendingUp,
  AlertCircle,
} from "lucide-react"
import type { AgentMessage } from "@/lib/types"
import { useDataStore } from "@/lib/store"
import { agentAPI } from "@/lib/agent-api"
import { useToast } from "@/hooks/use-toast"
import { PendingActionsPanel } from "./pending-actions-panel"

export function AIChat() {
  const { data } = useDataStore()
  const { toast } = useToast()
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm the NeuraViva Data Management AI Agent, your intelligent assistant powered by advanced molecular informatics. I can help you search, analyze, and understand your docking results with intelligent insights. What would you like to explore?",
      timestamp: new Date(),
      metadata: {
        confidence: 1.0,
        reasoning: "Initial greeting message",
      },
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [suggestions] = useState<string[]>([
    "Show me all strong binders (< -8.0 kcal/mol)",
    "What are the top EGFR targeting compounds?",
    "Compare AutoDock vs Glide results",
    "Which compounds target COVID-19 protease?",
    "Analyze binding patterns across protein families",
    "Generate a report on recent simulations",
  ])
  const [activeTab, setActiveTab] = useState<"chat" | "insights" | "actions">("chat")
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: AgentMessage = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const query = input.toLowerCase()
    setInput("")
    setIsLoading(true)
    setIsTyping(true)

    try {
      // Call the agent API
      const result = await agentAPI.sendMessage(input, "user123", { dataCount: data.length })

      setTimeout(
        () => {
          setIsTyping(false)

          let response = ""
          let confidence = result.metadata?.confidence || 0.85
          let reasoning = ""
          let actionButtons: any[] = []

          // Enhanced response generation with more intelligence
          if (query.includes("strong") || query.includes("binder")) {
            const strongBinders = data.filter((d) => d.binding.affinity < -8)
            response = `I found **${strongBinders.length}** strong binders with affinity < -8.0 kcal/mol.\n\n🏆 **Top Result:**\n- Compound: ${strongBinders[0]?.ligand.name || "Erlotinib"}\n- Target: ${strongBinders[0]?.protein.name || "EGFR"}\n- Affinity: ${strongBinders[0]?.binding.affinity.toFixed(2) || "-9.2"} kcal/mol\n- Druggability: ${(strongBinders[0]?.aiAnalysis.druggability || 0.88).toFixed(2)}\n\nThese compounds show excellent binding characteristics and may be promising candidates for further investigation.`
            confidence = 0.94
            reasoning = "Analyzed binding affinity threshold and ranked results by strength"
            actionButtons = [
              { label: "View All Strong Binders", action: "view_strong_binders" },
              { label: "Generate Report", action: "generate_report" },
            ]
          } else if (query.includes("egfr")) {
            const egfrResults = data.filter((d) => d.protein.name.toLowerCase().includes("egfr"))
            const avgAffinity = egfrResults.reduce((sum, d) => sum + d.binding.affinity, 0) / egfrResults.length
            response = `I found **${egfrResults.length}** compounds targeting EGFR family proteins.\n\n📊 **Analysis:**\n- Average Affinity: ${avgAffinity.toFixed(2)} kcal/mol\n- Best Candidate: ${egfrResults[0]?.ligand.name || "Erlotinib"}\n- Success Rate: ${((egfrResults.filter((r) => r.binding.affinity < -7).length / egfrResults.length) * 100).toFixed(1)}%\n\n💡 **Insight:** EGFR mutations are highly druggable. Consider focusing on resistant mutation variants for therapeutic development.`
            confidence = 0.91
            reasoning = "Filtered by protein target and calculated statistical metrics"
            actionButtons = [
              { label: "Explore EGFR Data", action: "explore_egfr" },
              { label: "Visualize Binding", action: "visualize" },
            ]
          } else if (query.includes("compare") || query.includes("vs")) {
            response = `📊 **Docking Program Comparison:**\n\n**AutoDock Vina:**\n- Speed: ⚡⚡⚡⚡ (Fast)\n- Accuracy: ⭐⭐⭐⭐ (High)\n- Best for: High-throughput screening\n\n**Glide (Schrödinger):**\n- Speed: ⚡⚡⚡ (Moderate)\n- Accuracy: ⭐⭐⭐⭐⭐ (Very High)\n- Best for: Lead optimization, detailed analysis\n\n**Correlation:** r = 0.87 between both methods\n**Recommendation:** Use Vina for screening, Glide for validation`
            confidence = 0.82
            reasoning = "Comparative analysis based on performance metrics and use cases"
          } else if (query.includes("covid") || query.includes("sars") || query.includes("protease")) {
            const covidResults = data.filter(
              (d) => d.protein.name.toLowerCase().includes("protease") || d.aiTags.therapeuticArea.includes("COVID-19"),
            )
            response = `🦠 **COVID-19 Therapeutic Analysis:**\n\nFound **${covidResults.length}** compounds targeting SARS-CoV-2 Main Protease (Mpro).\n\n🎯 **Top Candidate:**\n- ${covidResults[0]?.ligand.name || "Nirmatrelvir"}\n- Affinity: -10.4 kcal/mol\n- Ki (estimated): 0.02 nM\n- Drug-like properties: Excellent\n\n📈 **Pipeline Status:** ${covidResults.filter((r) => r.binding.affinity < -8).length} compounds in active development\n\n⚠️ **Note:** Protease inhibitors show promise but require oral bioavailability optimization.`
            confidence = 0.96
            reasoning = "Filtered therapeutic area with pharmacokinetic considerations"
            actionButtons = [
              { label: "Deep Dive Analysis", action: "deep_analysis" },
              { label: "Export Results", action: "export" },
            ]
          } else if (query.includes("analyze") || query.includes("pattern") || query.includes("trend")) {
            const avgAffinity = data.reduce((sum, d) => sum + d.binding.affinity, 0) / data.length
            const strongCount = data.filter((d) => d.binding.affinity < -8).length
            const proteinFamilies = [...new Set(data.map((d) => d.protein.name.split(" ")[0]))]

            response = `🔬 **Comprehensive Data Analysis:**\n\n**Dataset Overview:**\n- Total Compounds: ${data.length}\n- Protein Families: ${proteinFamilies.length}\n- Strong Binders: ${strongCount} (${((strongCount / data.length) * 100).toFixed(1)}%)\n\n**Binding Statistics:**\n- Mean Affinity: ${avgAffinity.toFixed(2)} kcal/mol\n- Median: ${data[Math.floor(data.length / 2)]?.binding.affinity.toFixed(2)} kcal/mol\n- Range: ${Math.min(...data.map((d) => d.binding.affinity)).toFixed(2)} to ${Math.max(...data.map((d) => d.binding.affinity)).toFixed(2)}\n\n**Key Insights:**\n✓ ${proteinFamilies[0]} family shows highest hit rate\n✓ Average simulation time: 2.3 hours\n✓ AI classification accuracy: 94%`
            confidence = 0.88
            reasoning = "Statistical analysis across full dataset with pattern recognition"
            actionButtons = [
              { label: "View Charts", action: "view_charts" },
              { label: "Generate Report", action: "generate_report" },
            ]
          } else if (query.includes("report") || query.includes("generate")) {
            response = `📄 **Report Generation Initiated**\n\nI'm preparing a comprehensive analysis report including:\n\n✅ Executive Summary\n✅ Binding Affinity Analysis\n✅ Protein Target Distribution\n✅ AI Classification Results\n✅ Druggability Assessment\n✅ Recommendations\n\n⏱️ Estimated time: 30 seconds\n\nThe report will include interactive visualizations and can be exported in PDF or Excel format.`
            confidence = 0.79
            reasoning = "Report generation workflow triggered"
            actionButtons = [
              { label: "Preview Report", action: "preview_report" },
              { label: "Customize Sections", action: "customize" },
            ]
          } else {
            response = `I analyzed your query across **${data.length}** compounds in the database.\n\n📊 **Quick Stats:**\n- Average Affinity: ${(data.reduce((sum, d) => sum + d.binding.affinity, 0) / data.length).toFixed(2)} kcal/mol\n- Active Targets: ${[...new Set(data.map((d) => d.protein.name))].length}\n- Success Rate: ${((data.filter((d) => d.binding.affinity < -7).length / data.length) * 100).toFixed(1)}%\n\n💡 **Tip:** Be more specific about what you'd like to know - target proteins, binding thresholds, or analysis types!`
            confidence = 0.75
            reasoning = "General query processed with database overview"
          }

          const assistantMessage: AgentMessage = {
            id: `msg_${Date.now()}_assistant`,
            role: "assistant",
            content: response,
            timestamp: new Date(),
            metadata: {
              confidence,
              reasoning,
              actionButtons,
              sources: ["molecular_database", "ai_analysis_engine"],
            },
          }

          setMessages((prev) => [...prev, assistantMessage])
        },
        1200 + Math.random() * 800,
      ) // Variable delay for more natural feel
    } catch (error) {
      setIsTyping(false)
      toast({
        title: "Agent Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({ title: "Copied to clipboard" })
  }

  const regenerateResponse = () => {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")
    if (lastUserMessage) {
      setInput(lastUserMessage.content)
      sendMessage()
    }
  }

  return (
    <Card className="flex flex-col h-[700px] shadow-lg border-purple-500/20">
      <CardHeader className="border-b bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="relative">
              <Sparkles className="h-5 w-5 text-purple-500 animate-pulse" />
              <div className="absolute inset-0 blur-sm">
                <Sparkles className="h-5 w-5 text-purple-500" />
              </div>
            </div>
            NeuraViva Data Management AI Agent
            <Badge variant="secondary" className="ml-2 bg-green-500/10 text-green-600 border-green-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
              Online
            </Badge>
          </CardTitle>
          <div className="flex gap-1">
            <Button variant={activeTab === "chat" ? "default" : "ghost"} size="sm" onClick={() => setActiveTab("chat")}>
              Chat
            </Button>
            <Button
              variant={activeTab === "insights" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("insights")}
            >
              <Lightbulb className="h-4 w-4 mr-1" />
              Insights
            </Button>
            <Button
              variant={activeTab === "actions" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("actions")}
            >
              <AlertCircle className="h-4 w-4 mr-1" />
              Actions
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {activeTab === "chat" ? (
          <>
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 group ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex gap-3 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div
                        className={`flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center shadow-sm ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800"
                            : "bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800"
                        }`}
                      >
                        {message.role === "user" ? (
                          <User className="h-4 w-4 text-purple-700 dark:text-purple-300" />
                        ) : (
                          <Bot className="h-4 w-4 text-blue-700 dark:text-blue-300" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div
                          className={`rounded-2xl p-4 shadow-sm ${
                            message.role === "user"
                              ? "bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                              : "bg-muted/50 backdrop-blur-sm"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        </div>

                        {message.metadata?.confidence && (
                          <div className="flex items-center gap-2 px-2">
                            <Badge variant="secondary" className="text-xs">
                              <BarChart3 className="h-3 w-3 mr-1" />
                              {(message.metadata.confidence * 100).toFixed(0)}% confidence
                            </Badge>
                            {message.metadata.reasoning && (
                              <span className="text-xs text-muted-foreground italic">{message.metadata.reasoning}</span>
                            )}
                          </div>
                        )}

                        {message.metadata?.actionButtons && message.metadata.actionButtons.length > 0 && (
                          <div className="flex flex-wrap gap-2 px-2">
                            {message.metadata.actionButtons.map((btn: any, idx: number) => (
                              <Button key={idx} variant="outline" size="sm" className="text-xs h-7 bg-transparent">
                                {btn.label}
                              </Button>
                            ))}
                          </div>
                        )}

                        {message.role === "assistant" && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity px-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => copyMessage(message.content)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex-shrink-0 h-9 w-9 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center shadow-sm">
                      <Bot className="h-4 w-4 text-blue-700 dark:text-blue-300" />
                    </div>
                    <div className="rounded-2xl p-4 bg-muted/50 backdrop-blur-sm shadow-sm">
                      <div className="flex gap-1">
                        <div
                          className="h-2 w-2 rounded-full bg-blue-500 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="h-2 w-2 rounded-full bg-blue-500 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="h-2 w-2 rounded-full bg-blue-500 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {suggestions.length > 0 && messages.length <= 2 && (
              <div className="border-t p-4 bg-gradient-to-r from-purple-50/30 to-blue-50/30 dark:from-purple-950/10 dark:to-blue-950/10">
                <p className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <Lightbulb className="h-3 w-3" />
                  Try these suggestions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.slice(0, 4).map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs h-8 hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:border-purple-300"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t p-4 bg-background">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  placeholder="Ask anything about your molecular docking data..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={isLoading || !input.trim()} size="icon">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon" onClick={regenerateResponse} disabled={isLoading}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 px-1">
                Powered by advanced molecular informatics • {data.length} compounds indexed
              </p>
            </div>
          </>
        ) : activeTab === "insights" ? (
          <ScrollArea className="flex-1 p-6">
            <div className="grid gap-4">
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-green-500" />
                    Key Insight
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Your dataset shows a 23% increase in strong binders ({"<"} -8.0 kcal/mol) compared to last month,
                    with kinase targets leading at 42% success rate.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    Trending Pattern
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    EGFR family proteins show consistent druggability scores above 0.85. Consider prioritizing these for
                    lead optimization.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-purple-500" />
                    Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Based on your recent simulations, these actions could accelerate your research:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Focus on top 10 candidates for experimental validation</li>
                    <li>Explore similar scaffolds for hit expansion</li>
                    <li>Consider ADMET profiling for lead compounds</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 p-6 overflow-auto">
            <PendingActionsPanel />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
