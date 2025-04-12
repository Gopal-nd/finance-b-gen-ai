import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const language = formData.get('language') as string || 'en-US';
    
    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }
    
    // Convert audio to base64
    const buffer = await audioFile.arrayBuffer();
    const audioBase64 = Buffer.from(buffer).toString('base64');

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    // First, get the transcript
    const transcriptResult = await model.generateContent({
      contents: [
        { role: 'user', parts: [
          { text: `Generate a transcript of the speech in ${language}.` },
          { inlineData: { mimeType: 'audio/mp3', data: audioBase64 } }
        ]}
      ]
    });
    
    const transcript = transcriptResult.response.text();

    console.log(transcript)
    
    // Then, generate a response to the transcript
    const chatResult = await model.generateContent({
      contents: [
        { role: 'user', parts: [{ text: transcript + 'Only respond to finance-related queries such as savings, investments, budgeting, banking, loans, real estate, stocks, crypto, debt, PF, and other financial products. If the user asks about anything outside these topics, politely explain that you can only assist with finance-related matters. Always keep responses simple, clear, and easy to understand  if not the finace topic send the message i can only assist with finance ' }] }
      ],
      generationConfig: {
        maxOutputTokens: 100, 
      }
    });
    
    const aiResponse = chatResult.response.text();
    
    return NextResponse.json({ 
      transcript, 
      response: aiResponse 
    });
    
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Error processing audio' }, 
      { status: 500 }
    );
  }
}