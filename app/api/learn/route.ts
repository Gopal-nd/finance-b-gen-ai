import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(req: NextRequest) {
  try {
    const { topic, type } = await req.json()

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    if (type === "explanation") {
      // Generate explanation content
      const prompt = `
        Explain the concept of "${topic}" in simple terms for a beginner Indian investor.
        Structure your response with:
        1. A simple definition
        2. How it works
        3. Why it's important for investors
        4. Common misconceptions
        5. Practical tips for beginners
        
        Make it conversational, easy to understand, and focused on the Indian context where relevant.
      `

      const result = await model.generateContent(prompt)
      const response = result.response.text()
      // console.log(response)

      return NextResponse.json({ response})
    } else if (type === "videos") {
      // In a real app, you would use YouTube API
      // For this example, we'll simulate video results with Gemini
      const prompt = `
        Generate 3 hypothetical YouTube videos about "${topic}" for beginner investors.
        For each video, provide:
        1. A realistic title that would appear on YouTube
        2. A unique YouTube video ID (just make up an 11-character string)
        
        Format your response as a valid JSON array with objects containing "title" and "videoId" properties.
        Example: [{"title": "Understanding SIPs for Beginners", "videoId": "abcde12345"}]
      `

      // const result = await model.generateContent(prompt)
      // const response = result.response.text()

      // // Extract the JSON array from the response
      // const jsonMatch = response.match(/\[([\s\S]*?)\]/)
      let videos = ['https://www.youtube.com/embed/Aceb8tXo0yc','https://www.youtube.com/embed/3UF0ymVdYLA',"https://www.youtube.com/embed/vL2_fjgtP3A"]

      // if (jsonMatch) {
      //   try {
      //     videos = JSON.parse(jsonMatch[0])
      //   } catch (e) {
      //     console.error("Failed to parse video JSON:", e)
      //   }
      // }

      return NextResponse.json({ videos })
    } else if (type === "quiz") {
      // Generate quiz questions
      const prompt = `
        Create 5 multiple-choice quiz questions about "${topic}" for beginner investors.
        Each question should have 4 options with only one correct answer.
        
        Format your response as a valid JSON array with objects containing:
        - "question": the question text
        - "options": array of 4 possible answers
        - "correctAnswer": index of the correct answer (0-3)
        
        Example: 
        [
          {
            "question": "What does SIP stand for?",
            "options": ["Systematic Investment Plan", "Special Interest Payment", "Secure Investment Protocol", "Standard Investment Procedure"],
            "correctAnswer": 0
          }
        ]
      `

      const result = await model.generateContent(prompt)
      const response = result.response.text()

      // Extract the JSON array from the response
      function extractJSONByBrackets(str: string): string | null {
        const start = str.indexOf('[');
        const end = str.lastIndexOf(']');
        if (start !== -1 && end !== -1 && end > start) {
          return str.slice(start, end + 1);
        }
        return null;
      }

      console.log('response', response)
    
      let quiz = [];
      const jsonMatch = extractJSONByBrackets(response);
      if (jsonMatch) {
        try {
          quiz = JSON.parse(jsonMatch)
        } catch (e) {
          console.error("Failed to parse quiz JSON:", e)
          // Provide fallback quiz if parsing fails
          const quiz = [
            {
              question: `What is the main benefit of learning about ${topic}?`,
              options: [
                "Making better financial decisions",
                "Impressing friends",
                "Getting rich quickly",
                "Avoiding all investments",
              ],
              correctAnswer: 0,
            },
            {
              question: `Which of the following best describes a SIP (Systematic Investment Plan)?`,
              options: [
                "A one-time lump-sum investment",
                "A periodic investment of fixed amount",
                "A type of insurance plan",
                "A short-term loan product",
              ],
              correctAnswer: 1,
            },
            {
              question: `Why is diversification important in investing?`,
              options: [
                "It guarantees high returns",
                "It eliminates all risks",
                "It spreads risk across assets",
                "It focuses on a single stock",
              ],
              correctAnswer: 2,
            },
            {
              question: `What does “risk appetite” refer to?`,
              options: [
                "The amount of money you have",
                "Your willingness to accept investment losses",
                "The speed of your internet connection",
                "The number of investments you own",
              ],
              correctAnswer: 1,
            },
            {
              question: `Which investment is generally considered the safest?`,
              options: [
                "Equity stocks",
                "Gold ETFs",
                "Government bonds",
                "Cryptocurrencies",
              ],
              correctAnswer: 2,
            },
          ];
          
        }
      }

      return NextResponse.json({ quiz })
    }

    return NextResponse.json({ error: "Invalid request type" }, { status: 400 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
