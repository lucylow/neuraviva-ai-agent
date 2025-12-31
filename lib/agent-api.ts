// AI Agent API client for frontend
import type {
  AgentMessage,
  AgentQueryResult,
  ActionRequest,
  ActionResponse,
  PendingAction,
  ApprovalSettings,
  ActionHistory,
} from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"

export class AgentAPI {
  private static instance: AgentAPI

  static getInstance(): AgentAPI {
    if (!AgentAPI.instance) {
      AgentAPI.instance = new AgentAPI()
    }
    return AgentAPI.instance
  }

  async sendMessage(message: string, userId: string, context?: Record<string, any>): Promise<AgentQueryResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agent/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          userId,
          context,
        }),
      })

      if (!response.ok) {
        throw new Error(`Agent request failed: ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Agent message failed:", error)
      throw error
    }
  }

  async executeAction(request: ActionRequest): Promise<ActionResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agent/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`Action execution failed: ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Action execution failed:", error)
      throw error
    }
  }

  async getConversationHistory(userId: string, limit = 10): Promise<AgentMessage[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agent/history?userId=${userId}&limit=${limit}`)

      if (!response.ok) {
        throw new Error(`Failed to get conversation history: ${response.statusText}`)
      }

      const data = await response.json()
      return data.messages || []
    } catch (error) {
      console.error("[v0] Failed to get conversation history:", error)
      return []
    }
  }

  async analyzeData(dataIds: string[], userId: string, analysisType?: string): Promise<ActionResponse> {
    return this.executeAction({
      type: "analysis",
      parameters: {
        dataIds,
        analysisType: analysisType || "comprehensive",
      },
      userId,
      priority: "medium",
    })
  }

  async generateVisualization(dataIds: string[], userId: string, visualizationType?: string): Promise<ActionResponse> {
    return this.executeAction({
      type: "visualization",
      parameters: {
        dataIds,
        visualizationType: visualizationType || "auto",
        interactive: true,
      },
      userId,
      priority: "medium",
    })
  }

  async generateReport(data: any[], userId: string, reportType?: string): Promise<ActionResponse> {
    return this.executeAction({
      type: "report",
      parameters: {
        data,
        reportType: reportType || "standard",
        format: "pdf",
        includeVisualizations: true,
      },
      userId,
      priority: "low",
    })
  }

  async uploadAndProcess(file: File, userId: string, metadata?: Record<string, any>): Promise<ActionResponse> {
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("userId", userId)
      if (metadata) {
        formData.append("metadata", JSON.stringify(metadata))
      }

      const response = await fetch(`${API_BASE_URL}/api/agent/upload`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Upload and process failed:", error)
      throw error
    }
  }

  async getPendingActions(userId: string): Promise<PendingAction[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agent/pending-actions?userId=${userId}`)

      if (!response.ok) {
        throw new Error(`Failed to get pending actions: ${response.statusText}`)
      }

      const data = await response.json()
      return data.actions || []
    } catch (error) {
      console.error("[v0] Failed to get pending actions:", error)
      return []
    }
  }

  async approveAction(actionId: string, userId: string, feedback?: string): Promise<ActionResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agent/approve-action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          actionId,
          userId,
          feedback,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to approve action: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("[v0] Failed to approve action:", error)
      throw error
    }
  }

  async rejectAction(actionId: string, userId: string, reason: string): Promise<ActionResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agent/reject-action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          actionId,
          userId,
          reason,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to reject action: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("[v0] Failed to reject action:", error)
      throw error
    }
  }

  async getApprovalSettings(userId: string): Promise<ApprovalSettings | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agent/approval-settings?userId=${userId}`)

      if (!response.ok) {
        throw new Error(`Failed to get approval settings: ${response.statusText}`)
      }

      const data = await response.json()
      return data.settings
    } catch (error) {
      console.error("[v0] Failed to get approval settings:", error)
      return null
    }
  }

  async updateApprovalSettings(userId: string, settings: Partial<ApprovalSettings>): Promise<ActionResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agent/approval-settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          settings,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update approval settings: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("[v0] Failed to update approval settings:", error)
      throw error
    }
  }

  async getActionHistory(userId: string, limit = 20): Promise<ActionHistory[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agent/action-history?userId=${userId}&limit=${limit}`)

      if (!response.ok) {
        throw new Error(`Failed to get action history: ${response.statusText}`)
      }

      const data = await response.json()
      return data.history || []
    } catch (error) {
      console.error("[v0] Failed to get action history:", error)
      return []
    }
  }

  async getAutonomousConfig(userId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agent/autonomous-config?userId=${userId}`)

      if (!response.ok) {
        throw new Error(`Failed to get autonomous config: ${response.statusText}`)
      }

      const data = await response.json()
      return data.config
    } catch (error) {
      console.error("[v0] Failed to get autonomous config:", error)
      return null
    }
  }

  async updateAutonomousConfig(userId: string, config: any): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agent/autonomous-config`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          config,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update autonomous config: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("[v0] Failed to update autonomous config:", error)
      throw error
    }
  }

  async getScheduledTasks(userId: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agent/scheduled-tasks?userId=${userId}`)

      if (!response.ok) {
        throw new Error(`Failed to get scheduled tasks: ${response.statusText}`)
      }

      const data = await response.json()
      return data.tasks || []
    } catch (error) {
      console.error("[v0] Failed to get scheduled tasks:", error)
      return []
    }
  }

  async scheduleTask(userId: string, task: any): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agent/scheduled-tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          task,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to schedule task: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("[v0] Failed to schedule task:", error)
      throw error
    }
  }

  async getProactiveInsights(userId: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agent/insights?userId=${userId}`)

      if (!response.ok) {
        throw new Error(`Failed to get proactive insights: ${response.statusText}`)
      }

      const data = await response.json()
      return data.insights || []
    } catch (error) {
      console.error("[v0] Failed to get proactive insights:", error)
      return []
    }
  }

  async acknowledgeInsight(insightId: string, userId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agent/insights/${insightId}/acknowledge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error(`Failed to acknowledge insight: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("[v0] Failed to acknowledge insight:", error)
      throw error
    }
  }

  async executeInsightAction(insightId: string, userId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agent/insights/${insightId}/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error(`Failed to execute insight action: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("[v0] Failed to execute insight action:", error)
      throw error
    }
  }
}

export const agentAPI = AgentAPI.getInstance()
