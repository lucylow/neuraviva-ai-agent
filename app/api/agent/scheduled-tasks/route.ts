import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId is required" }, { status: 400 })
    }

    // Mock scheduled tasks
    const tasks = [
      {
        id: "task_1",
        type: "scheduled",
        action: "weekly_report",
        parameters: { format: "pdf", recipients: ["user@example.com"] },
        schedule: {
          frequency: "weekly",
          nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
        priority: "medium",
        status: "pending",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        executedCount: 4,
      },
      {
        id: "task_2",
        type: "scheduled",
        action: "data_backup",
        parameters: { destination: "cloud_storage" },
        schedule: {
          frequency: "daily",
          nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000),
          lastRun: new Date(),
        },
        priority: "high",
        status: "pending",
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        executedCount: 60,
      },
    ]

    return NextResponse.json({ success: true, tasks })
  } catch (error) {
    console.error("[v0] Get scheduled tasks error:", error)
    return NextResponse.json({ success: false, error: "Failed to get tasks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, task } = body

    if (!userId || !task) {
      return NextResponse.json({ success: false, error: "userId and task are required" }, { status: 400 })
    }

    console.log("[v0] Scheduling task:", { userId, task })

    const newTask = {
      ...task,
      id: `task_${Date.now()}`,
      createdAt: new Date(),
      executedCount: 0,
      status: "pending",
    }

    return NextResponse.json({
      success: true,
      message: "Task scheduled successfully",
      task: newTask,
    })
  } catch (error) {
    console.error("[v0] Schedule task error:", error)
    return NextResponse.json({ success: false, error: "Failed to schedule task" }, { status: 500 })
  }
}
