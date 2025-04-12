import { genAI } from "@/lib/ai";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
 
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
      headers: await headers() // you need to pass the headers object.
  })

  const userd = session?.user.id
  console.log(userd)
  try {
    const body = await req.json();
    const { history } = body;

    if (!history || history.length === 0 || history[0].role !== "user") {
      return NextResponse.json(
        { error: "History must start with a user turn." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where:{
        id:userd
      },select:{
        goals:true,
        incomeLevel:true,
        age:true,
        employmentType:true,
        investmentExperience:true,
        location:true,
        monthlySavings:true,
        investmentDuration:true,
        isTaxSavingPriority:true,
        name:true,
      }
    })


    const systemPrompt = {
      role: "user",
      parts: [
        {
          text: `You are a financial assistant speaking to ${user}. Only respond to finance-related queries such as savings, investments, budgeting, banking, loans, real estate, stocks, crypto, debt, PF, and other financial products. If the user asks about anything outside these topics, politely explain that you can only assist with finance-related matters. Always keep responses simple, clear, and easy to understand.`,
        },
      ],
    };
    

    const chat = genAI.chats.create({
      model: "gemini-2.0-flash",
      history: [systemPrompt, ...history.map((msg: any) => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      }))],
      config: {
        maxOutputTokens: 200,
        temperature: 0.9,
      },
    });

    const stream = await chat.sendMessageStream({
      message: history.at(-1).text,
    });

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    (async () => {
      for await (const chunk of stream) {
        const text = chunk.text;
        const encoded = new TextEncoder().encode(text);
        await writer.write(encoded);
      }
      await writer.close();
    })();

    return new NextResponse(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
