// State management using React hooks and Context
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import { dataApi } from "./api"
import { webSocketService } from "./websocket"
import { mockDockingResults, mockProjects, mockProcessingJobs, mockSystemStats, mockActivities } from "./mock-data"
import type { DockingResult, ProcessingJob, QueryFilters, ResearchProject, SystemStats, Activity, User } from "./types"

interface DataState {
  data: DockingResult[]
  projects: ResearchProject[]
  processingJobs: ProcessingJob[]
  selectedData: DockingResult | null
  stats: SystemStats | null
  activities: Activity[]
  filters: QueryFilters
  loading: boolean
  error: string | null
  useMockData: boolean
  setUseMockData: (useMock: boolean) => void

  setData: (data: DockingResult[]) => void
  setProjects: (projects: ResearchProject[]) => void
  setProcessingJobs: (jobs: ProcessingJob[]) => void
  setSelectedData: (data: DockingResult | null) => void
  setStats: (stats: SystemStats) => void
  setActivities: (activities: Activity[]) => void
  setFilters: (filters: QueryFilters) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  fetchData: (filters?: QueryFilters) => Promise<void>
  fetchProjects: () => Promise<void>
  fetchStats: () => Promise<void>
  uploadFile: (file: File, metadata: any) => Promise<string>
  updateJobStatus: (jobId: string, updates: Partial<ProcessingJob>) => void
  refreshData: () => Promise<void>

  setupWebSocket: () => void
  cleanupWebSocket: () => void
}

export const useDataStore = create<DataState>()(
  devtools(
    persist(
      (set, get) => ({
        data: [],
        projects: [],
        processingJobs: [],
        selectedData: null,
        stats: null,
        activities: [],
        filters: {},
        loading: false,
        error: null,
        useMockData: true,

        setData: (data) => set({ data }),
        setProjects: (projects) => set({ projects }),
        setProcessingJobs: (jobs) => set({ processingJobs: jobs }),
        setSelectedData: (data) => set({ selectedData: data }),
        setStats: (stats) => set({ stats }),
        setActivities: (activities) => set({ activities }),
        setFilters: (filters) => set({ filters }),
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),

        setUseMockData: (useMock) => {
          set({ useMockData: useMock })
          if (useMock) {
            set({
              data: mockDockingResults,
              projects: mockProjects,
              processingJobs: mockProcessingJobs,
              stats: mockSystemStats,
              activities: mockActivities,
            })
          }
        },

        fetchData: async (filters = {}) => {
          if (get().useMockData) {
            set({ loading: true })
            await new Promise((resolve) => setTimeout(resolve, 500))
            let filteredData = [...mockDockingResults]

            if (filters.program) {
              filteredData = filteredData.filter((item) => filters.program?.includes(item.simulation.program))
            }
            if (filters.minAffinity !== undefined) {
              filteredData = filteredData.filter((item) => item.binding.affinity >= (filters.minAffinity || 0))
            }
            if (filters.maxAffinity !== undefined) {
              filteredData = filteredData.filter((item) => item.binding.affinity <= (filters.maxAffinity || 0))
            }

            set({ data: filteredData, loading: false })
            return
          }

          set({ loading: true, error: null })
          try {
            const appliedFilters = filters || get().filters
            const result = await dataApi.queryData(appliedFilters, 1, 100)
            set({ data: result.data, loading: false })
          } catch (error: any) {
            const errorMessage = error?.message || "Failed to fetch data. Please try again."
            console.error("[v0] Failed to fetch data:", error)
            set({ error: errorMessage, loading: false, data: mockDockingResults })
          }
        },

        fetchProjects: async () => {
          if (get().useMockData) {
            set({ loading: true })
            await new Promise((resolve) => setTimeout(resolve, 300))
            set({ projects: mockProjects, loading: false })
            return
          }

          set({ loading: true, error: null })
          try {
            const projects = await dataApi.getProjects()
            set({ projects, loading: false })
          } catch (error: any) {
            const errorMessage = error?.message || "Failed to fetch projects. Please try again."
            console.error("[v0] Failed to fetch projects:", error)
            set({ error: errorMessage, loading: false, projects: mockProjects })
          }
        },

        fetchStats: async () => {
          if (get().useMockData) {
            set({ stats: mockSystemStats })
            return
          }

          try {
            const stats = await dataApi.getStats()
            set({ stats })
          } catch (error: any) {
            console.error("[v0] Failed to fetch stats:", error)
            set({ stats: mockSystemStats })
          }
        },

        uploadFile: async (file, metadata) => {
          set({ loading: true, error: null })
          try {
            if (!file) {
              throw new Error("No file selected")
            }
            if (!metadata.projectId) {
              throw new Error("Please select a project")
            }

            const result = await dataApi.uploadFile(file, metadata)

            const newJob: ProcessingJob = {
              id: result.jobId,
              userId: typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "",
              filePath: file.name,
              status: "pending",
              createdAt: new Date(),
            }

            set((state) => ({
              processingJobs: [newJob, ...state.processingJobs],
              loading: false,
            }))

            return result.jobId
          } catch (error: any) {
            const errorMessage = error?.message || "Failed to upload file. Please try again."
            console.error("[v0] Upload failed:", error)
            set({ error: errorMessage, loading: false })
            throw error
          }
        },

        updateJobStatus: (jobId, updates) => {
          if (!jobId) {
            console.error("[v0] Invalid jobId for update")
            return
          }

          set((state) => ({
            processingJobs: state.processingJobs.map((job) => (job.id === jobId ? { ...job, ...updates } : job)),
          }))
        },

        refreshData: async () => {
          try {
            await Promise.all([get().fetchData(), get().fetchProjects(), get().fetchStats()])
          } catch (error) {
            console.error("[v0] Failed to refresh data:", error)
            // Individual errors are already handled in each fetch function
          }
        },

        setupWebSocket: () => {
          try {
            webSocketService.connect()

            webSocketService.subscribe("processing", (data) => {
              try {
                const { jobId, status, result, error } = data
                get().updateJobStatus(jobId, { status, result, error })

                if (status === "completed" && result) {
                  set((state) => ({
                    data: [result, ...state.data],
                  }))

                  const activity: Activity = {
                    id: `activity_${Date.now()}`,
                    type: "upload",
                    user: typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "",
                    description: `Uploaded ${result.protein.name} docking result`,
                    timestamp: new Date(),
                    metadata: { jobId, protein: result.protein.name },
                  }

                  set((state) => ({
                    activities: [activity, ...state.activities.slice(0, 49)],
                  }))
                }
              } catch (error) {
                console.error("[v0] Error processing WebSocket message:", error)
              }
            })

            webSocketService.subscribe("activity", (activity: Activity) => {
              try {
                set((state) => ({
                  activities: [activity, ...state.activities.slice(0, 49)],
                }))
              } catch (error) {
                console.error("[v0] Error processing activity:", error)
              }
            })
          } catch (error) {
            console.error("[v0] Failed to setup WebSocket:", error)
          }
        },

        cleanupWebSocket: () => {
          try {
            webSocketService.disconnect()
          } catch (error) {
            console.error("[v0] Failed to cleanup WebSocket:", error)
          }
        },
      }),
      {
        name: "neuraviva-data-storage",
        partialize: (state) => ({
          filters: state.filters,
          selectedData: state.selectedData,
          useMockData: state.useMockData,
        }),
      },
    ),
  ),
)

interface UserState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null

  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => Promise<void>
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        loading: false,
        error: null,

        setUser: (user) => set({ user }),
        setToken: (token) => set({ token, isAuthenticated: !!token }),
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),

        logout: async () => {
          if (typeof window !== "undefined") {
            localStorage.clear()
          }
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
          })
        },
      }),
      {
        name: "neuraviva-user-storage",
      },
    ),
  ),
)
