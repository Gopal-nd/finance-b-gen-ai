// app/api/recommend/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { ai } from '@/lib/ai'
import prisma from '@/lib/prisma'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json([], { status: 401 })

  const recs = await prisma.recommendation.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(recs)
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: any = {}
  try {
    const text = await req.text()
    if (text) body = JSON.parse(text)
  } catch {
    body = {}
  }

  const { product, rationale } = body

  // Manual addition
  if (product && rationale) {
    const rec = await prisma.recommendation.create({
      data: { userId: session.user.id, product, reason: rationale },
    })
    return NextResponse.json(rec)
  }

  // Fetch user + previous recommendations
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      age: true,
      recomandations: true,
      riskProfile: true,
      dependentsCount: true,
      employmentType: true,
      incomeLevel: true,
      investmentDuration: true,
      isTaxSavingPriority: true,
      monthlySavings: true,
      goals: true,
      investmentExperience: true,
      preferredLanguages: true,
      location: true,
    },
  })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const previous = await prisma.recommendation.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  // Build Prompt
  const prompt = `
You are a financial advisor for Indian investors.
User profile:
${JSON.stringify(user, null, 2)}

Previous recommendations:
${JSON.stringify(previous, null, 2)}

Now give 1 new and different recommendations (mutual funds, SIPs, stocks, or any relevant financial products), based on the profile above. For each, include a short rationale (2-3 sentences).

Return the result in this JSON format:

  {
    "product": "Product name or type",
    "reason": "Short reason why it's recommended"
  }

`.trim()

  // Gemini Call

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  console.log("Gemini says:", response);
  function extractJSON(str:any) {
    try {
      // Remove code block formatting (```json ... ```)
      const cleaned = str.replace(/```json|```/g, '').trim();
      
      // Parse and return JSON
      console.log('cleaned', cleaned)
      return JSON.parse(cleaned);
    } catch (error:any) {
      console.error("Invalid JSON input:", error.message);
      return null;
    }
  }

  const data = extractJSON(response);
  

  
   const save = await    prisma.recommendation.create({
        data: {
          userId: session.user.id,
          product: data.product,
          reason: data.reason,
        },
      })
    
  

  return NextResponse.json(save)
}

export async function DELETE(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 })

  await prisma.recommendation.deleteMany({
    where: { id, userId: session.user.id },
  })

  return NextResponse.json({ success: true })
}
