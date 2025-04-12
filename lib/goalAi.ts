// import { generateText } from "ai"
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// const result = await model.generateContent(prompt);
// const response = result.response.text();
export async function generateGoalAdvice({
  goalName,
  targetAmount,
  durationMonths,
  monthlySIP,
}: {
  goalName: string
  targetAmount: number
  durationMonths: number
  monthlySIP: number
}) {
  const prompt = `
    I'm planning a financial goal: "${goalName}" with a target amount of ₹${targetAmount.toLocaleString("en-IN")} 
    over ${durationMonths} months with a monthly SIP of ₹${monthlySIP.toLocaleString("en-IN")}.
    
    Please provide:
    1. A suggested investment plan (in 5-10 words)
    2. A detailed reasoning for this plan (in 2-3 sentences)
    
    Format your response as JSON:
    {
      "suggestedPlan": "Your suggested plan here",
      "reasoning": "Your detailed reasoning here"
    }
  `

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return JSON.parse(response)
  } catch (error) {
    console.error("Error generating goal advice:", error)
    return {
      suggestedPlan: getSuggestedPlanFallback(durationMonths),
      reasoning: getReasoningFallback(durationMonths),
    }
  }
}

export async function generateGoalChatResponse({
  goalName,
  targetAmount,
  durationMonths,
  monthlySIP,
  suggestedPlan,
  question,
}: {
  goalName: string
  targetAmount: number
  durationMonths: number
  monthlySIP: number
  suggestedPlan: string
  question: string
}) {
  const prompt = `
    I have a financial goal: "${goalName}" with a target amount of ₹${targetAmount.toLocaleString("en-IN")} 
    over ${durationMonths} months with a monthly SIP of ₹${monthlySIP.toLocaleString("en-IN")}.
    
    The suggested investment plan is: "${suggestedPlan}"
    
    My question is: "${question}"
    
    Please provide a helpful, informative response as a financial advisor. Include specific numbers and calculations 
    where relevant. Keep your response under 200 words and focus on practical advice.
  `

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return response
  } catch (error) {
    console.error("Error generating chat response:", error)
    return `I apologize, but I'm having trouble generating a response right now. 
    
    For your ${goalName} goal with a target of ₹${targetAmount.toLocaleString("en-IN")} over ${durationMonths} months, 
    please continue with your monthly SIP of ₹${monthlySIP.toLocaleString("en-IN")} as planned. 
    
    If you have specific questions about adjusting your plan, risk management, or investment options, please try asking again later.`
  }
}

// Fallback functions in case the AI fails
function getSuggestedPlanFallback(durationMonths: number) {
  if (durationMonths <= 12) {
    return "Debt Funds and Fixed Deposits"
  } else if (durationMonths <= 36) {
    return "Balanced Mutual Fund Portfolio"
  } else {
    return "Equity-oriented Mutual Funds"
  }
}

function getReasoningFallback(durationMonths: number) {
  if (durationMonths <= 12) {
    return "For short-term goals under 1 year, capital protection is crucial. Debt funds and fixed deposits provide stability and predictable returns, ensuring your funds are ready when you need them without market risk."
  } else if (durationMonths <= 36) {
    return "For medium-term goals of 1-3 years, a balanced approach with a mix of debt and equity mutual funds provides stability while allowing for growth to beat inflation. This approach balances risk and returns for your goal."
  } else {
    return "With a long-term horizon over 3 years, equity-oriented mutual funds can provide higher returns to build your corpus effectively. The longer time frame allows for riding out market volatility while maximizing growth potential."
  }
}
