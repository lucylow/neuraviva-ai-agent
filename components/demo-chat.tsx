"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Sparkles, Cpu } from "lucide-react"

const initialMessages = [
  {
    role: "assistant",
    content:
      "Hello! I'm DataCurator AI. I can help you understand docking simulations, analyze protein-ligand interactions, and manage your research data. Try asking me anything!",
    suggestions: [
      "What is the strongest kinase inhibitor?",
      "How do I upload a Vina result?",
      "Show me proteins for cancer research",
    ],
  },
]

export function DemoChat() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    setMessages((prev) => [...prev, { role: "user", content: input }])
    setInput("")
    setLoading(true)

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I found 428 kinase inhibitors in our database. The strongest binding affinity is -12.3 kcal/mol for protein 1A2G with ligand STI-571 (Imatinib). Would you like me to show you the top 10 results?",
          suggestions: ["Show top 10 results", "Explain binding affinity", "Find similar proteins"],
        },
      ])
      setLoading(false)
    }, 1500)
  }

  return (
    <div id="demo">
      <h2 className="text-3xl font-bold text-foreground mb-6">Try Our AI Agent</h2>
      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
        Experience the power of our Data Management AI Agent. Ask questions about docking simulations, protein
        interactions, or data management.
      </p>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">DataCurator AI Demo</h3>
                <p className="text-sm text-muted-foreground">Powered by Gemini AI & ElizaOS</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-muted-foreground" />
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        <div className="h-96 overflow-y-auto p-4 bg-secondary/30">
          {messages.map((message, i) => (
            <div key={i} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
              <div
                className={`inline-block max-w-[80%] rounded-xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                    : "bg-card text-card-foreground border border-border"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>

                {message.suggestions && (
                  <div className="mt-3 pt-3 border-t border-border/30">
                    <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
                    <div className="flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, j) => (
                        <button
                          key={j}
                          onClick={() => setInput(suggestion)}
                          className="text-xs px-3 py-1.5 rounded-full bg-background/50 hover:bg-background transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="mb-4 text-left">
              <div className="inline-block max-w-[80%] rounded-xl px-4 py-3 bg-card border border-border">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                  <div className="h-2 w-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                  <div className="h-2 w-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
                  <span className="text-sm text-muted-foreground ml-2">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about docking simulations, data management..."
              className="flex-1"
              disabled={loading}
            />
            <Button type="submit" disabled={loading || !input.trim()} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-2 text-center">
            This demo uses our public API. Responses are simulated for demonstration purposes.
          </p>
        </div>
      </div>
    </div>
  )
}
