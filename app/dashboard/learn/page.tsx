"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const topics = [
  {
    title: "SIP (Systematic Investment Plan)",
    description: "Learn how regular investments can build wealth over time",
    icon: "💰",
    slug: "sip-systematic-investment-plan",
  },
  {
    title: "Mutual Funds",
    description: "Understand how professionally managed investment portfolios work",
    icon: "📊",
    slug: "mutual-funds",
  },
  {
    title: "Stock Market Basics",
    description: "Get started with understanding equity markets and share trading",
    icon: "📈",
    slug: "stock-market-basics",
  },
  {
    title: "Diversification",
    description: "Learn why not putting all your eggs in one basket is important",
    icon: "🧩",
    slug: "diversification",
  },
  {
    title: "Risk Management",
    description: "Strategies to protect your investments from market volatility",
    icon: "🛡️",
    slug: "risk-management",
  },
  {
    title: "Tax-Saving Investments",
    description: "Understand options to save taxes while growing your money",
    icon: "💸",
    slug: "tax-saving-investments",
  },
]

export default function LearnPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Financial Literacy Hub</h1>
        <p className="text-muted-foreground mb-8">
          Learn essential financial concepts to make better investment decisions
        </p>

        <h2 className="text-xl font-semibold mb-6">Popular Topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((topic) => (
            <Card key={topic.slug} className="transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{topic.icon}</span>
                  {topic.title}
                </CardTitle>
                <CardDescription>{topic.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => router.push(`/dashboard/learn/${topic.slug}`)}>
                  Start Learning
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
