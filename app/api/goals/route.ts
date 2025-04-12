import { type NextRequest, NextResponse } from "next/server"


import { addMonths, format } from "date-fns"
import prisma from "@/lib/prisma"
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { generateGoalAdvice } from "@/lib/goalAi";

// GET /api/goals - Get all goals for the current user
export async function GET() {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
    
  try {
    const user = session?.user
    // console.log(user)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const goals = await prisma.goal.findMany({
      where: {
        userId: user.id,
      },
    })

    

    return NextResponse.json(goals)
  } catch (error) {
    console.error("Error fetching goals:", error)
    return NextResponse.json({ error: "Failed to fetch goals" }, { status: 500 })
  }
}

// POST /api/goals - Create a new goal
export async function POST(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
      });
    
  try {
    const user = session?.user

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, emoji, targetAmount, durationMonths, monthlySIP } = body

    // Validate required fields
    if (!name || !targetAmount || !durationMonths || !monthlySIP) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate AI advice if not provided
    let { suggestedPlan, reasoning } = body

    if (!suggestedPlan || !reasoning) {
      const aiAdvice = await generateGoalAdvice({
        goalName: name,
        targetAmount,
        durationMonths,
        monthlySIP,
      })


      suggestedPlan = aiAdvice.suggestedPlan
      reasoning = aiAdvice.reasoning
    }

    // Generate progress tracking data
    const progressData = []
    const startDate = new Date()

    for (let i = 0; i < Math.min(durationMonths, 36); i++) {
      const date = addMonths(startDate, i)
      progressData.push({
        month: format(date, "MMM yyyy"),
        completed: false,
      })
    }

    // Create the goal with progress data
    const goal = await prisma.goal.create({
      data: {
        userId: user.id,
        name,
        emoji: emoji || "💰",
        targetAmount,
        durationMonths,
        monthlySIP,
        suggestedPlan,
        reasoning,
        progressData: {
          create: progressData,
        },
      },
      include: {
        progressData: true,
      },
    })

    console.log(goal)

    return NextResponse.json(goal)
  } catch (error) {
    console.error("Error creating goal:", error)
    return NextResponse.json({ error: "Failed to create goal" }, { status: 500 })
  }
}
