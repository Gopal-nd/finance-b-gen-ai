import { NextRequest, NextResponse } from "next/server";
import { userProfileSchema } from "@/lib/validation/ProfileSchema";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id
      },
      select: {
        age: true,
        incomeLevel: true,
        riskProfile: true,
        goals: true,
        investmentExperience: true,
        preferredLanguages: true,
        monthlySavings: true,
        investmentDuration: true,
        location: true,
        employmentType: true,
        dependentsCount: true,
        isTaxSavingPriority: true,
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const data = userProfileSchema.parse(body);

  const existing = await prisma.user.update({
    where: {
      id: session?.user?.id
    },
    data: {
      age: data.age,
      incomeLevel: data.incomeLevel,
      riskProfile: data.riskProfile,
      goals: data.goals,
      investmentExperience: data.investmentExperience,
      preferredLanguages: data.preferredLanguages,
      monthlySavings: data.monthlySavings,
      investmentDuration: data.investmentDuration,
      location: data.location,
      employmentType: data.employmentType,
      dependentsCount: data.dependentsCount,
      isTaxSavingPriority: data.isTaxSavingPriority,
    }
  });

  return NextResponse.json({ success: true });
}
