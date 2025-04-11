
import fs from "fs";
import { GoogleGenAI, createUserContent, createPartFromUri } from "@google/genai";

export const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });



export const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });

export async function getAudioTranscript(filePath: string, mimeType: string) {
  const fileData = fs.readFileSync(filePath, { encoding: "base64" });

  const contents = [
    { text: "Generate a transcript of the speech." },
    {
      inlineData: {
        mimeType,
        data: fileData,
      },
    },
  ];

  const result = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents,
  });

  return result.text;
  

}

export async function AIRecomandations(prompt:string) {
  const response = await genAI.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config:{
      maxOutputTokens: 500,
       temperature: 0.7
    }
  });
  return response.text
}