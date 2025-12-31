// API service for backend communication
import axios, { type AxiosError } from "axios"
import type { DockingResult, ResearchProject, ProcessingJob, QueryFilters, SystemStats, User } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      try {
        const token = localStorage.getItem("token")
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch (error) {
        console.error("[v0] Failed to get auth token:", error)
      }
    }
    return config
  },
  (error) => {
    console.error("[v0] Request interceptor error:", error)
    return Promise.reject(error)
  },
)

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    console.error("[v0] API Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    })

    if (error.response?.status === 401 && typeof window !== "undefined") {
      try {
        const refreshToken = localStorage.getItem("refreshToken")
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          })

          if (response.data?.token) {
            localStorage.setItem("token", response.data.token)
            if (error.config && error.config.headers) {
              error.config.headers.Authorization = `Bearer ${response.data.token}`
              return axios(error.config)
            }
          }
        }
      } catch (refreshError) {
        console.error("[v0] Token refresh failed:", refreshError)
        localStorage.clear()
        if (typeof window !== "undefined") {
          window.location.href = "/dashboard"
        }
      }
    }

    const apiError = new ApiError(
      error.response?.data?.message || error.message || "An error occurred",
      error.response?.status,
      error.code,
    )
    return Promise.reject(apiError)
  },
)

export const dataApi = {
  uploadFile: async (
    file: File,
    metadata: {
      program: string
      projectId: string
      description?: string
      verifyOnBlockchain?: boolean
    },
  ): Promise<{ jobId: string }> => {
    if (!file) {
      throw new ApiError("File is required", 400)
    }
    if (!metadata.program || !metadata.projectId) {
      throw new ApiError("Program and projectId are required", 400)
    }
    if (file.size > 50 * 1024 * 1024) {
      throw new ApiError("File size exceeds 50MB limit", 400)
    }

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("program", metadata.program)
      formData.append("projectId", metadata.projectId)
      if (metadata.description) {
        formData.append("description", metadata.description)
      }
      if (metadata.verifyOnBlockchain !== undefined) {
        formData.append("verifyOnBlockchain", String(metadata.verifyOnBlockchain))
      }

      const response = await api.post("/data/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    } catch (error) {
      if (error instanceof ApiError) throw error
      throw new ApiError("Failed to upload file. Please try again.", 500)
    }
  },

  queryData: async (
    filters: QueryFilters,
    page = 1,
    limit = 20,
  ): Promise<{
    data: DockingResult[]
    page: number
    limit: number
    total: number
  }> => {
    if (page < 1) page = 1
    if (limit < 1 || limit > 100) limit = 20

    try {
      const response = await api.post("/data/query", {
        filters,
        page,
        limit,
      })
      return response.data
    } catch (error) {
      if (error instanceof ApiError) throw error
      throw new ApiError("Failed to query data. Please try again.", 500)
    }
  },

  getDataById: async (id: string): Promise<DockingResult> => {
    if (!id) {
      throw new ApiError("Data ID is required", 400)
    }

    try {
      const response = await api.get(`/data/${id}`)
      return response.data.data
    } catch (error) {
      if (error instanceof ApiError) throw error
      throw new ApiError("Failed to fetch data. Please try again.", 500)
    }
  },

  getJobStatus: async (jobId: string): Promise<ProcessingJob> => {
    if (!jobId) {
      throw new ApiError("Job ID is required", 400)
    }

    try {
      const response = await api.get(`/data/status/${jobId}`)
      return response.data.status
    } catch (error) {
      if (error instanceof ApiError) throw error
      throw new ApiError("Failed to fetch job status. Please try again.", 500)
    }
  },

  getProjects: async (): Promise<ResearchProject[]> => {
    try {
      const response = await api.get("/projects")
      return response.data
    } catch (error) {
      if (error instanceof ApiError) throw error
      throw new ApiError("Failed to fetch projects. Please try again.", 500)
    }
  },

  createProject: async (project: Omit<ResearchProject, "id">): Promise<ResearchProject> => {
    if (!project.name || !project.userId) {
      throw new ApiError("Project name and userId are required", 400)
    }

    try {
      const response = await api.post("/projects", project)
      return response.data
    } catch (error) {
      if (error instanceof ApiError) throw error
      throw new ApiError("Failed to create project. Please try again.", 500)
    }
  },

  getStats: async (): Promise<SystemStats> => {
    try {
      const response = await api.get("/system/stats")
      return response.data
    } catch (error) {
      console.error("[v0] Failed to fetch stats:", error)
      return {
        totalDataPoints: 0,
        blockchainEntries: 0,
        storageUsed: "0 GB",
        processingQueue: 0,
      }
    }
  },

  exportData: async (filters: QueryFilters, format: "csv" | "json"): Promise<Blob> => {
    if (!format || !["csv", "json"].includes(format)) {
      throw new ApiError("Invalid export format", 400)
    }

    try {
      const response = await api.post("/data/export", { filters, format }, { responseType: "blob" })
      return response.data
    } catch (error) {
      if (error instanceof ApiError) throw error
      throw new ApiError("Failed to export data. Please try again.", 500)
    }
  },

  chatWithAgent: async (
    message: string,
  ): Promise<{
    response: string
    suggestions?: string[]
    data?: DockingResult[]
  }> => {
    if (!message || message.trim().length === 0) {
      throw new ApiError("Message is required", 400)
    }

    try {
      const response = await api.post("/agent/chat", { message: message.trim() })
      return response.data
    } catch (error) {
      if (error instanceof ApiError) throw error
      throw new ApiError("Failed to chat with agent. Please try again.", 500)
    }
  },
}

export const authApi = {
  loginWithWallet: async (
    signature: string,
    message: string,
    address: string,
  ): Promise<{
    token: string
    refreshToken: string
    user: User
  }> => {
    if (!signature || !message || !address) {
      throw new ApiError("Signature, message, and address are required", 400)
    }

    try {
      const response = await api.post("/auth/wallet", {
        signature,
        message,
        address,
      })
      return response.data
    } catch (error) {
      if (error instanceof ApiError) throw error
      throw new ApiError("Failed to login with wallet. Please try again.", 500)
    }
  },

  loginWithEmail: async (
    email: string,
    password: string,
  ): Promise<{
    token: string
    refreshToken: string
    user: User
  }> => {
    if (!email || !password) {
      throw new ApiError("Email and password are required", 400)
    }

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      })
      return response.data
    } catch (error) {
      if (error instanceof ApiError) throw error
      throw new ApiError("Failed to login. Please check your credentials.", 401)
    }
  },

  logout: async (): Promise<void> => {
    try {
      if (typeof window !== "undefined") {
        const refreshToken = localStorage.getItem("refreshToken")
        if (refreshToken) {
          await api.post("/auth/logout", { refreshToken })
        }
        localStorage.clear()
      }
    } catch (error) {
      console.error("[v0] Logout error:", error)
      if (typeof window !== "undefined") {
        localStorage.clear()
      }
    }
  },
}

export const blockchainApi = {
  verifyData: async (
    dataId: string,
  ): Promise<{
    verified: boolean
    blockchainTx: string
    explorerUrl: string
    timestamp: Date
  }> => {
    if (!dataId) {
      throw new ApiError("Data ID is required", 400)
    }

    try {
      const response = await api.get(`/blockchain/verify/${dataId}`)
      return response.data
    } catch (error) {
      if (error instanceof ApiError) throw error
      throw new ApiError("Failed to verify data on blockchain. Please try again.", 500)
    }
  },

  getTransaction: async (txSignature: string): Promise<any> => {
    if (!txSignature) {
      throw new ApiError("Transaction signature is required", 400)
    }

    try {
      const response = await api.get(`/blockchain/tx/${txSignature}`)
      return response.data
    } catch (error) {
      if (error instanceof ApiError) throw error
      throw new ApiError("Failed to fetch transaction. Please try again.", 500)
    }
  },

  getUserNFTs: async (address: string): Promise<any[]> => {
    if (!address) {
      throw new ApiError("Wallet address is required", 400)
    }

    try {
      const response = await api.get(`/blockchain/nfts/${address}`)
      return response.data
    } catch (error) {
      console.error("[v0] Failed to fetch NFTs:", error)
      return []
    }
  },
}

export default api
