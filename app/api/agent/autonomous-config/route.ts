import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId is required" }, { status: 400 })
    }

    // Mock autonomous config
    const config = {
      userId,
      autonomyLevel: "semi-autonomous",
      autoExecuteThreshold: {
        low: true,
        medium: false,
        high: false,
        critical: false,
      },
      learningEnabled: true,
      proactiveMonitoring: true,
      taskScheduling: true,
      selfImprovement: true,
    }

    return NextResponse.json({ success: true, config })
  } catch (error) {
    console.error("[v0] Get autonomous config error:", error)
    return NextResponse.json({ success: false, error: "Failed to get config" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, config } = body

    if (!userId || !config) {
      return NextResponse.json({ success: false, error: "userId and config are required" }, { status: 400 })
    }

    console.log("[v0] Updating autonomous config:", { userId, config })

    return NextResponse.json({
      success: true,
      message: "Autonomous configuration updated successfully",
      config,
    })
  } catch (error) {
    console.error("[v0] Update autonomous config error:", error)
    return NextResponse.json({ success: false, error: "Failed to update config" }, { status: 500 })
  }
}
