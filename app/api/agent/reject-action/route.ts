import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { actionId, userId, reason } = body

    console.log("[v0] Rejecting action:", { actionId, userId, reason })

    if (!actionId || !userId || !reason) {
      return NextResponse.json({ success: false, error: "actionId, userId, and reason are required" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      result: {
        actionId,
        status: "rejected",
        rejectedAt: new Date(),
        reason,
      },
      message: "Action has been rejected",
    })
  } catch (error) {
    console.error("[v0] Reject action error:", error)
    return NextResponse.json({ success: false, error: "Failed to reject action" }, { status: 500 })
  }
}
