import { type NextRequest, NextResponse } from "next/server"
import type { PendingAction } from "@/lib/types"

// Mock pending actions store
const mockPendingActions: PendingAction[] = [
  {
    id: "action_1",
    type: "batch_operation",
    title: "Batch Upload 45 Docking Results",
    description:
      "AI detected 45 new docking simulation files in the uploads folder. Would you like to process and upload them to the database?",
    proposedBy: "ai_agent",
    userId: "user123",
    parameters: {
      fileCount: 45,
      estimatedSize: "2.3 GB",
      programs: ["AutoDock Vina", "Glide"],
    },
    impact: "medium",
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    reasoning:
      "Detected new simulation files that match your project criteria. Batch processing will save time and ensure consistency.",
    estimatedTime: "~5 minutes",
    affectedResources: ["database", "storage"],
    previewData: {
      sampleFiles: ["compound_A_egfr_vina.pdbqt", "compound_B_covid_glide.mae", "..."],
      targetProteins: ["EGFR", "COVID-19 Mpro", "ALK"],
    },
  },
  {
    id: "action_2",
    type: "data_modification",
    title: "Update Binding Affinity Thresholds",
    description:
      "Based on recent analysis, I recommend adjusting the 'strong binder' threshold from -8.0 to -7.5 kcal/mol for this project to capture more candidates.",
    proposedBy: "ai_agent",
    userId: "user123",
    parameters: {
      currentThreshold: -8.0,
      proposedThreshold: -7.5,
      affectedCompounds: 23,
    },
    impact: "low",
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    reasoning:
      "Statistical analysis shows that your validation rate for compounds between -7.5 and -8.0 is 78%, suggesting the current threshold may be too conservative.",
    estimatedTime: "Instant",
    affectedResources: ["project_settings", "23 compound classifications"],
  },
  {
    id: "action_3",
    type: "blockchain_transaction",
    title: "Verify 12 Results on Blockchain",
    description:
      "12 high-value results ready for immutable blockchain verification. This will create permanent records on Solana.",
    proposedBy: "ai_agent",
    userId: "user123",
    parameters: {
      resultIds: ["res_001", "res_002", "..."],
      estimatedCost: "0.012 SOL (~$2.40)",
      compounds: ["Erlotinib", "Nirmatrelvir", "Crizotinib", "..."],
    },
    impact: "high",
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    reasoning:
      "These results meet your publication criteria. Blockchain verification will provide immutable proof of discovery date and data integrity for patent protection.",
    estimatedTime: "~30 seconds",
    affectedResources: ["blockchain", "wallet"],
    previewData: {
      totalCost: "0.012 SOL",
      compounds: 12,
      dataSize: "450 KB",
    },
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId is required" }, { status: 400 })
    }

    // Filter by user and pending status
    const userActions = mockPendingActions.filter((action) => action.userId === userId && action.status === "pending")

    return NextResponse.json({
      success: true,
      actions: userActions,
      count: userActions.length,
    })
  } catch (error) {
    console.error("[v0] Get pending actions error:", error)
    return NextResponse.json({ success: false, error: "Failed to get pending actions" }, { status: 500 })
  }
}
