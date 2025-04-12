import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { headers } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"


// GET /api/goals/[id] - Get a specific goal
export async function GET(request: NextRequest,  { params }: { params: Promise<{ id: string }> }) {

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    const user = session?.user
    
    const { id } = await params; // Await the params object
    if (!user ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const goal = await prisma.goal.findUnique({
      where: {
        id: id,
      },
      include: {
        chatMessages: {
          orderBy: {
            createdAt: "asc",
          },
        },
        progressData: {
          orderBy: {
            month: "asc",
          },
        },
      },
    })

    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 })
    }

    // Check if the goal belongs to the current user
    if (goal.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(goal)
  } catch (error) {
    console.error("Error fetching goal:", error)
    return NextResponse.json({ error: "Failed to fetch goal" }, { status: 500 })
  }
}

// PUT /api/goals/[id] - Update a goal
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth.api.getSession({
        headers: await headers(),
      })
      const user = session?.user
  

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the goal exists and belongs to the user
    const existingGoal = await prisma.goal.findUnique({
      where: {
        id: params.id,
      },
    })
    console.log('reached 1')
    if (!existingGoal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 })
    }

    if (existingGoal.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    console.log('reached 2')

    const body = await request.json()
    const { name, emoji, targetAmount, durationMonths, monthlySIP, suggestedPlan, reasoning, isCompleted, progress } =
      body

    // Update the goal
    const updatedGoal = await prisma.goal.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        emoji,
        targetAmount,
        durationMonths,
        monthlySIP,
        suggestedPlan,
        reasoning,
        isCompleted,
        progress,
      },
      include: {
        chatMessages: true,
        progressData: true,
      },
    })
    console.log(updatedGoal)

    return NextResponse.json(updatedGoal)
  } catch (error) {
    console.error("Error updating goal:", error)
    return NextResponse.json({ error: "Failed to update goal" }, { status: 500 })
  }
}

// DELETE /api/goals/[id] - Delete a goal
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth.api.getSession({
        headers: await headers(),
      })
      const user = session?.user
  

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the goal exists and belongs to the user
    const existingGoal = await prisma.goal.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!existingGoal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 })
    }

    if (existingGoal.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Delete the goal (this will cascade delete related records)
    await prisma.goal.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting goal:", error)
    return NextResponse.json({ error: "Failed to delete goal" }, { status: 500 })
  }
}
