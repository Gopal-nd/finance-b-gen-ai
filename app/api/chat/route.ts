import { genAI } from "@/lib/ai";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
 
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

    // Prepend system instruction
    const systemPrompt = {
      role: "user",
      parts: [
        {
          text:
            "You are a financial assistant. Only respond to finance-related questions such as savings, investments, budgeting, crypto, stock market, etc. If the user's query is not finance-related, respond politely saying you can only help with finance-related topics. and make sure it should be easy to understand simple",
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
        maxOutputTokens: 500,
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
