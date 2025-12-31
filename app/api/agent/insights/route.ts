import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId is required" }, { status: 400 })
    }

    // Mock proactive insights
    const insights = [
      {
        id: "insight_1",
        type: "opportunity",
        title: "Batch Processing Optimization Available",
        description:
          "23 pending files can be processed together, reducing total computation time by 40% through parallelization.",
        severity: "info",
        actionable: true,
        suggestedAction: {
          type: "batch_optimize",
          parameters: { fileCount: 23, estimatedSavings: "2.5 hours" },
          autoExecutable: true,
        },
        dataPoints: ["processing_queue"],
        confidence: 0.92,
        createdAt: new Date(),
        acknowledged: false,
      },
      {
        id: "insight_2",
        type: "warning",
        title: "Unusual Binding Affinity Pattern Detected",
        description:
          "15 recent compounds show significantly lower binding affinities than historical average. This may indicate changes in docking parameters.",
        severity: "warning",
        actionable: true,
        suggestedAction: {
          type: "investigate_anomaly",
          parameters: { timeRange: "last_24h", metric: "binding_affinity" },
          autoExecutable: false,
        },
        dataPoints: ["compound_123", "compound_124", "compound_125"],
        confidence: 0.87,
        createdAt: new Date(),
        acknowledged: false,
      },
      {
        id: "insight_3",
        type: "recommendation",
        title: "Archive Old Project Data",
        description:
          "3 projects haven't been accessed in 90+ days. Archiving could free up 2.4 GB while maintaining retrieval capability.",
        severity: "info",
        actionable: true,
        suggestedAction: {
          type: "archive_projects",
          parameters: { projectIds: ["proj_1", "proj_2", "proj_3"], ageThreshold: 90 },
          autoExecutable: true,
        },
        dataPoints: ["storage_usage"],
        confidence: 0.88,
        createdAt: new Date(),
        acknowledged: false,
      },
    ]

    return NextResponse.json({ success: true, insights })
  } catch (error) {
    console.error("[v0] Get insights error:", error)
    return NextResponse.json({ success: false, error: "Failed to get insights" }, { status: 500 })
  }
}
