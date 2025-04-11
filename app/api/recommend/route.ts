// app/api/recommend/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { AIRecomandations } from '@/lib/ai'

const prisma = new PrismaClient()
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function GET(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })
    if (!session) return NextResponse.error()

    const recs = await prisma.recommendation.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(recs??{opps:'No recommendations found'})
}

export async function POST(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })
    if (!session) return NextResponse.error()

    const { product, rationale } = await req.json()
    // If both fields present → manual add
    if (product && rationale) {
        const rec = await prisma.recommendation.create({
            data: { userId: session.user.id, product, reason: rationale },
        })
        return NextResponse.json(rec)
    }

    // Otherwise → auto-generate via Gemini
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { age: true, recomandations: true, riskProfile: true, dependentsCount: true, employmentType: true, incomeLevel: true, investmentDuration: true, isTaxSavingPriority: true, monthlySavings: true, goals: true, investmentExperience: true, preferredLanguages: true, location: true },
    })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

        const recomandations = await prisma.recommendation.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
        })

    const prompt = `
You are a financial advisor for Indian investors.
User profile:
${JSON.stringify(user, null, 2)}

and this the recommendations that where given before ${JSON.stringify(recomandations, null, 2)},so give different and othet good one based on this is the user details and you should use it to generate recommendations
 (mutual funds, SIPs, or stocks).
and the reasons for the recommendation (2–3 sentences). the fromate should be like this 
{
    "product": "mutual funds/stcok/debt/sip/othet finacial products",
    "rationale": "this is the reason for the recommendation"}
  `.trim()

  console.log(prompt)
   const response = await AIRecomandations(prompt, 80, 0.7)

   console.log(response)
 
    return NextResponse.json("saved")
}

export async function DELETE(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })
    if (!session) return NextResponse.error()

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')!
    await prisma.recommendation.deleteMany({ where: { id, userId: session.user.id } })
    return NextResponse.json({ success: true })
}
