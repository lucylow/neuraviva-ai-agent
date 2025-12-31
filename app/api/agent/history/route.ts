import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId is required" }, { status: 400 })
    }

    // Simulate getting conversation history
    const messages = [
      {
        id: "1",
        role: "user" as const,
        content: "Show me all kinase docking results",
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: "2",
        role: "assistant" as const,
        content: "I found 45 kinase docking results. The average binding affinity is -7.8 kcal/mol.",
        timestamp: new Date(Date.now() - 3590000),
      },
      {
        id: "3",
        role: "user" as const,
        content: "Analyze the binding patterns",
        timestamp: new Date(Date.now() - 3000000),
      },
      {
        id: "4",
        role: "assistant" as const,
        content: "Analysis shows that kinases in the EGFR family have the strongest binding patterns...",
        timestamp: new Date(Date.now() - 2990000),
      },
    ].slice(0, limit)

    return NextResponse.json({
      success: true,
      messages,
      total: messages.length,
    })
  } catch (error) {
    console.error("[v0] Get history error:", error)
    return NextResponse.json({ success: false, error: "Failed to get conversation history" }, { status: 500 })
  }
}
