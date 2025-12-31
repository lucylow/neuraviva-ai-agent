"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Clock, Trash2 } from "lucide-react"
import { useState } from "react"

export function ConversationHistory() {
  const [conversations] = useState([
    {
      id: "1",
      title: "EGFR Compound Analysis",
      timestamp: "2 hours ago",
      messageCount: 12,
      tags: ["EGFR", "Analysis"],
    },
    {
      id: "2",
      title: "COVID-19 Protease Search",
      timestamp: "Yesterday",
      messageCount: 8,
      tags: ["COVID-19", "Search"],
    },
    {
      id: "3",
      title: "Binding Affinity Comparison",
      timestamp: "2 days ago",
      messageCount: 15,
      tags: ["Comparison", "Statistics"],
    },
  ])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Recent Conversations
          </span>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className="p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{conv.title}</h4>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {conv.timestamp}
                  </span>
                  <span>{conv.messageCount} messages</span>
                </div>
                <div className="flex gap-1 mt-2">
                  {conv.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
