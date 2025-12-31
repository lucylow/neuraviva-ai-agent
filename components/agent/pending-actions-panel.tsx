"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Database,
  FileUp,
  Shield,
  FileText,
  Trash2,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import type { PendingAction } from "@/lib/types"
import { agentAPI } from "@/lib/agent-api"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"

const impactIcons = {
  low: Clock,
  medium: AlertCircle,
  high: AlertCircle,
  critical: AlertCircle,
}

const impactColors = {
  low: "text-blue-500 bg-blue-50 border-blue-200",
  medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
  high: "text-orange-600 bg-orange-50 border-orange-200",
  critical: "text-red-600 bg-red-50 border-red-200",
}

const typeIcons = {
  data_modification: Database,
  file_upload: FileUp,
  blockchain_transaction: Shield,
  report_generation: FileText,
  data_deletion: Trash2,
  batch_operation: Layers,
}

export function PendingActionsPanel() {
  const [actions, setActions] = useState<PendingAction[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedAction, setExpandedAction] = useState<string | null>(null)
  const [processingAction, setProcessingAction] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState<string>("")
  const [showRejectForm, setShowRejectForm] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadPendingActions()
    const interval = setInterval(loadPendingActions, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  const loadPendingActions = async () => {
    try {
      const data = await agentAPI.getPendingActions("user123")
      setActions(data)
    } catch (error) {
      console.error("Failed to load pending actions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (actionId: string) => {
    setProcessingAction(actionId)
    try {
      const result = await agentAPI.approveAction(actionId, "user123")
      toast({
        title: "Action Approved",
        description: result.message,
      })
      await loadPendingActions()
    } catch (error) {
      toast({
        title: "Approval Failed",
        description: "Failed to approve action. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingAction(null)
    }
  }

  const handleReject = async (actionId: string) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for rejecting this action.",
        variant: "destructive",
      })
      return
    }

    setProcessingAction(actionId)
    try {
      const result = await agentAPI.rejectAction(actionId, "user123", rejectionReason)
      toast({
        title: "Action Rejected",
        description: result.message,
      })
      setShowRejectForm(null)
      setRejectionReason("")
      await loadPendingActions()
    } catch (error) {
      toast({
        title: "Rejection Failed",
        description: "Failed to reject action. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingAction(null)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center text-muted-foreground">
            <Clock className="h-5 w-5 animate-spin mr-2" />
            Loading pending actions...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (actions.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-green-500" />
            <p className="font-medium">No Pending Actions</p>
            <p className="text-sm mt-1">All AI suggestions have been reviewed</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            Pending Approvals
          </span>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-yellow-300">
            {actions.length} Action{actions.length !== 1 ? "s" : ""}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {actions.map((action) => {
              const ImpactIcon = impactIcons[action.impact]
              const TypeIcon = typeIcons[action.type]
              const isExpanded = expandedAction === action.id
              const isProcessing = processingAction === action.id
              const isShowingReject = showRejectForm === action.id

              return (
                <Card key={action.id} className={`border-2 transition-all ${impactColors[action.impact]}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`rounded-lg p-2 ${impactColors[action.impact]}`}>
                        <TypeIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h4 className="font-semibold text-sm">{action.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(action.createdAt).toRelativeTimeString?.() ||
                                new Date(action.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                          <Badge variant="outline" className={`${impactColors[action.impact]} shrink-0`}>
                            <ImpactIcon className="h-3 w-3 mr-1" />
                            {action.impact}
                          </Badge>
                        </div>

                        <p className="text-sm text-foreground/80 leading-relaxed mb-3">{action.description}</p>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                          <Clock className="h-3 w-3" />
                          <span>{action.estimatedTime}</span>
                          <span className="text-muted-foreground/50">•</span>
                          <span>{action.affectedResources.join(", ")}</span>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-7 mb-3"
                          onClick={() => setExpandedAction(isExpanded ? null : action.id)}
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="h-3 w-3 mr-1" />
                              Less Details
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3 w-3 mr-1" />
                              More Details
                            </>
                          )}
                        </Button>

                        {isExpanded && (
                          <div className="mb-3 p-3 bg-muted/50 rounded-lg space-y-2 text-sm">
                            <div>
                              <span className="font-medium">Reasoning:</span>
                              <p className="text-muted-foreground mt-1">{action.reasoning}</p>
                            </div>
                            {action.previewData && (
                              <div>
                                <span className="font-medium">Details:</span>
                                <pre className="text-xs mt-1 text-muted-foreground">
                                  {JSON.stringify(action.previewData, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}

                        {isShowingReject ? (
                          <div className="space-y-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                            <Textarea
                              placeholder="Please provide a reason for rejecting this action..."
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              className="min-h-[80px]"
                            />
                            <div className="flex gap-2">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleReject(action.id)}
                                disabled={isProcessing || !rejectionReason.trim()}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Confirm Reject
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setShowRejectForm(null)
                                  setRejectionReason("")
                                }}
                                disabled={isProcessing}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleApprove(action.id)}
                              disabled={isProcessing}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {isProcessing ? (
                                <Clock className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                              )}
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowRejectForm(action.id)}
                              disabled={isProcessing}
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
