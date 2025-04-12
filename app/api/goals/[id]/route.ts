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
