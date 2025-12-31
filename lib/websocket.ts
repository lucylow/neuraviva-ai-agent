// WebSocket service for real-time updates
import { io, type Socket } from "socket.io-client"
import type { Activity } from "./types"

class WebSocketService {
  private socket: Socket | null = null
  private subscribers: Map<string, ((data: any) => void)[]> = new Map()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  connect() {
    if (typeof window === "undefined") {
      console.warn("[v0] WebSocket cannot connect in server environment")
      return
    }

    if (this.socket?.connected) {
      console.log("[v0] WebSocket already connected")
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        console.warn("[v0] No auth token available for WebSocket connection")
      }

      this.socket = io(process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3001", {
        auth: { token },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: this.reconnectDelay,
        reconnectionAttempts: this.maxReconnectAttempts,
      })

      this.socket.on("connect", () => {
        console.log("[v0] WebSocket connected")
        this.reconnectAttempts = 0
        this.subscribeToChannels()
      })

      this.socket.on("disconnect", (reason) => {
        console.log("[v0] WebSocket disconnected:", reason)

        if (reason === "io server disconnect") {
          // Server initiated disconnect, try to reconnect
          this.socket?.connect()
        }
      })

      this.socket.on("connect_error", (error) => {
        console.error("[v0] WebSocket connection error:", error.message)
        this.reconnectAttempts++

        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.error("[v0] Max reconnection attempts reached")
        }
      })

      this.socket.on("error", (error) => {
        console.error("[v0] WebSocket error:", error)
      })

      this.on("processing_started", (data) => {
        try {
          this.notify("processing", data)
        } catch (error) {
          console.error("[v0] Error handling processing_started:", error)
        }
      })

      this.on("processing_completed", (data) => {
        try {
          this.notify("processing", data)
        } catch (error) {
          console.error("[v0] Error handling processing_completed:", error)
        }
      })

      this.on("processing_failed", (data) => {
        try {
          this.notify("processing", data)
        } catch (error) {
          console.error("[v0] Error handling processing_failed:", error)
        }
      })

      this.on("activity", (activity: Activity) => {
        try {
          this.notify("activity", activity)
        } catch (error) {
          console.error("[v0] Error handling activity:", error)
        }
      })
    } catch (error) {
      console.error("[v0] Failed to initialize WebSocket:", error)
    }
  }

  disconnect() {
    try {
      if (this.socket) {
        this.socket.disconnect()
        this.socket = null
        console.log("[v0] WebSocket disconnected successfully")
      }
    } catch (error) {
      console.error("[v0] Error disconnecting WebSocket:", error)
    }
  }

  subscribe(channel: string, callback: (data: any) => void) {
    if (!channel || typeof callback !== "function") {
      console.error("[v0] Invalid subscribe parameters")
      return
    }

    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, [])
    }
    this.subscribers.get(channel)!.push(callback)
  }

  unsubscribe(channel: string, callback: (data: any) => void) {
    if (!channel || typeof callback !== "function") {
      console.error("[v0] Invalid unsubscribe parameters")
      return
    }

    const callbacks = this.subscribers.get(channel)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  private notify(channel: string, data: any) {
    const callbacks = this.subscribers.get(channel)
    if (callbacks && callbacks.length > 0) {
      callbacks.forEach((callback) => {
        try {
          callback(data)
        } catch (error) {
          console.error(`[v0] Error in subscriber callback for channel ${channel}:`, error)
        }
      })
    }
  }

  private on(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  private subscribeToChannels() {
    try {
      if (typeof window === "undefined") return

      const userId = localStorage.getItem("userId")
      if (userId && this.socket) {
        this.socket.emit("subscribe", `user:${userId}`)
        this.socket.emit("subscribe", "system")
        console.log("[v0] Subscribed to user and system channels")
      }
    } catch (error) {
      console.error("[v0] Error subscribing to channels:", error)
    }
  }

  sendProcessingProgress(jobId: string, progress: number) {
    if (!jobId || typeof progress !== "number") {
      console.error("[v0] Invalid progress parameters")
      return
    }

    try {
      if (this.socket?.connected) {
        this.socket.emit("processing_progress", { jobId, progress })
      } else {
        console.warn("[v0] Cannot send progress: WebSocket not connected")
      }
    } catch (error) {
      console.error("[v0] Error sending progress:", error)
    }
  }

  joinProject(projectId: string) {
    if (!projectId) {
      console.error("[v0] Invalid projectId")
      return
    }

    try {
      if (this.socket?.connected) {
        this.socket.emit("subscribe", `project:${projectId}`)
        console.log(`[v0] Joined project: ${projectId}`)
      }
    } catch (error) {
      console.error("[v0] Error joining project:", error)
    }
  }

  leaveProject(projectId: string) {
    if (!projectId) {
      console.error("[v0] Invalid projectId")
      return
    }

    try {
      if (this.socket?.connected) {
        this.socket.emit("unsubscribe", `project:${projectId}`)
        console.log(`[v0] Left project: ${projectId}`)
      }
    } catch (error) {
      console.error("[v0] Error leaving project:", error)
    }
  }
}

export const webSocketService = new WebSocketService()
