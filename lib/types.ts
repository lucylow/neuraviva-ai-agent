// Type definitions for NeuraViva data management
export interface DockingResult {
  id: string
  protein: {
    pdbId: string
    name: string
    uniprotId?: string
    organism?: string
  }
  ligand: {
    name: string
    smiles: string
    inchi?: string
    molecularWeight: number
    logP?: number
    hBondDonors?: number
    hBondAcceptors?: number
  }
  simulation: {
    program: "vina" | "glide" | "gromacs" | "autodock" | "other"
    version: string
    parameters: Record<string, any>
    runtime: number
    timestamp: Date
  }
  binding: {
    affinity: number
    ki?: number
    bindingMode?: number
    poseCount: number
    bestPose: {
      coordinates: number[][]
      interactions: {
        type: string
        residues: string[]
        distance: number
      }[]
    }
  }
  aiTags: {
    proteinFamily: string[]
    therapeuticArea: string[]
    bindingStrength: "strong" | "moderate" | "weak" | "inconclusive"
    druggability: "high" | "medium" | "low"
    noveltyScore: number
  }
  storage: {
    cid: string
    solanaTx: string
    dataHash: string
    fileReferences: {
      original: string
      processed: string
      visualization?: string
    }
  }
  metadata: {
    createdBy: string
    createdAt: Date
    updatedAt: Date
    projectId: string
    validated: boolean
  }
}

export interface ResearchProject {
  id: string
  name: string
  description: string
  researchers: string[]
  walletAddress: string
  targets: ProteinTarget[]
  status: "active" | "completed" | "archived"
}

export interface ProteinTarget {
  id: string
  name: string
  gene: string
  organism: string
  uniprotId: string
  pdbIds: string[]
  pathways: string[]
  diseaseAssociations: string[]
}

export interface User {
  id: string
  walletAddress: string
  email?: string
  name: string
  role: "admin" | "researcher" | "viewer"
  preferences: Record<string, any>
}

export interface ProcessingJob {
  id: string
  userId: string
  filePath: string
  status: "pending" | "processing" | "completed" | "failed"
  result?: DockingResult
  error?: string
  startedAt?: Date
  completedAt?: Date
  createdAt: Date
}

export interface QueryFilters {
  proteinFamily?: string[]
  therapeuticArea?: string[]
  bindingStrength?: string[]
  program?: string[]
  minAffinity?: number
  maxAffinity?: number
  startDate?: Date
  endDate?: Date
  projectId?: string
  userId?: string
}

export interface SystemStats {
  totalDataPoints: number
  storageUsed: string
  blockchainEntries: number
  classificationAccuracy: string
  processingQueue: number
  recentActivity: Activity[]
}

export interface Activity {
  id: string
  type: "upload" | "query" | "verification" | "classification"
  user: string
  description: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface AgentConfig {
  name: string
  role: string
  capabilities: string[]
  personality: {
    tone: "professional" | "friendly" | "scientific"
    expertise: string[]
    communicationStyle: string
  }
  constraints: {
    maxTokens: number
    temperature: number
    responseTime: number
    dataPrivacy: boolean
  }
}

export interface AgentMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  metadata?: {
    embeddings?: number[]
    confidence?: number
    dataReferences?: string[]
  }
}

export interface AgentQueryResult {
  success: boolean
  data: any
  suggestions?: string[]
  analysis?: AgentAnalysisResult
  visualization?: VisualizationData
  metadata: {
    processingTime: number
    dataPoints: number
    confidence: number
    sources: string[]
  }
}

export interface AgentAnalysisResult {
  summary: string
  insights: string[]
  recommendations: string[]
  statistics: Record<string, number>
  trends: TrendData[]
}

export interface TrendData {
  metric: string
  values: number[]
  timestamps: Date[]
  trend: "increasing" | "decreasing" | "stable"
  confidence: number
}

export interface VisualizationData {
  type: "chart" | "table" | "molecule" | "network"
  data: any
  config: Record<string, any>
  interactive: boolean
}

export interface ActionRequest {
  type: "query" | "analysis" | "visualization" | "report" | "upload"
  parameters: Record<string, any>
  userId: string
  priority: "low" | "medium" | "high" | "urgent"
}

export interface ActionResponse {
  success: boolean
  result: any
  message: string
  nextSteps?: string[]
  errors?: string[]
}

export interface ConversationMemory {
  id: string
  userId: string
  messages: AgentMessage[]
  timestamp: Date
  metadata: {
    projectId?: string
    dataIds?: string[]
    actionsTaken: string[]
  }
}

export interface PendingAction {
  id: string
  type:
    | "data_modification"
    | "file_upload"
    | "blockchain_transaction"
    | "report_generation"
    | "data_deletion"
    | "batch_operation"
  title: string
  description: string
  proposedBy: "ai_agent"
  userId: string
  parameters: Record<string, any>
  impact: "low" | "medium" | "high" | "critical"
  status: "pending" | "approved" | "rejected" | "executed" | "failed"
  createdAt: Date
  reviewedAt?: Date
  executedAt?: Date
  reviewedBy?: string
  reasoning: string
  estimatedTime?: string
  affectedResources: string[]
  previewData?: any
}

export interface ApprovalSettings {
  userId: string
  requireApproval: {
    dataModification: boolean
    fileUpload: boolean
    blockchainTransaction: boolean
    reportGeneration: boolean
    dataDeletion: boolean
    batchOperation: boolean
  }
  autoApproveThreshold: {
    impact: "low" | "medium" | "high" | "critical"
  }
  notifications: {
    email: boolean
    inApp: boolean
  }
}

export interface ActionHistory {
  id: string
  actionId: string
  type: string
  status: "completed" | "failed" | "cancelled"
  approvedBy: string
  executedAt: Date
  result: any
  feedback?: {
    rating: number
    comment?: string
  }
}

export interface AutonomousAgentConfig {
  userId: string
  autonomyLevel: "supervised" | "semi-autonomous" | "fully-autonomous"
  autoExecuteThreshold: {
    low: boolean // Auto-execute low impact actions
    medium: boolean // Auto-execute medium impact actions
    high: boolean // Requires approval for high impact
    critical: boolean // Always requires approval for critical
  }
  learningEnabled: boolean
  proactiveMonitoring: boolean
  taskScheduling: boolean
  selfImprovement: boolean
}

export interface AgentTask {
  id: string
  type: "scheduled" | "triggered" | "proactive"
  action: string
  parameters: Record<string, any>
  schedule?: {
    frequency: "once" | "daily" | "weekly" | "monthly" | "realtime"
    nextRun: Date
    lastRun?: Date
  }
  trigger?: {
    condition: string
    threshold: any
    operator: "gt" | "lt" | "eq" | "contains"
  }
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "running" | "completed" | "failed" | "paused"
  createdAt: Date
  executedCount: number
}

export interface AgentDecision {
  id: string
  actionId: string
  decision: "execute" | "request_approval" | "skip"
  reasoning: string
  confidence: number
  riskAssessment: {
    level: "low" | "medium" | "high" | "critical"
    factors: string[]
    mitigations: string[]
  }
  learnedFromPast: boolean
  timestamp: Date
}

export interface AgentLearning {
  userId: string
  actionPattern: string
  userFeedback: "approved" | "rejected" | "modified"
  context: Record<string, any>
  outcome: "success" | "failure"
  timestamp: Date
  weight: number // How much this influences future decisions
}

export interface ProactiveInsight {
  id: string
  type: "anomaly" | "opportunity" | "warning" | "recommendation"
  title: string
  description: string
  severity: "info" | "warning" | "critical"
  actionable: boolean
  suggestedAction?: {
    type: string
    parameters: Record<string, any>
    autoExecutable: boolean
  }
  dataPoints: string[]
  confidence: number
  createdAt: Date
  acknowledged: boolean
}
