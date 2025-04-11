"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Calculator } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const calculatorCategories = [
  {
    title: "Savings & Investment",
    icon: "💰",
    calculators: [
      { id: "sip", name: "SIP Calculator", description: "Calculate returns from Systematic Investment Plans" },
      { id: "ppf", name: "PPF Calculator", description: "Estimate maturity amount for Public Provident Fund" },
      { id: "fd", name: "Fixed Deposit Calculator", description: "Calculate interest and maturity amount" },
      { id: "rd", name: "Recurring Deposit Calculator", description: "Plan regular investments in RDs" },
      {
        id: "lumpsum",
        name: "Lumpsum Investment Calculator",
        description: "Calculate returns from one-time investments",
      },
      { id: "nps", name: "NPS Calculator", description: "Estimate pension and lump sum based on contributions" },
    ],
  },
  {
    title: "Loan Calculators",
    icon: "🧮",
    calculators: [
      { id: "home-loan", name: "Home Loan EMI Calculator", description: "Calculate monthly EMI for home loans" },
      { id: "personal-loan", name: "Personal Loan Calculator", description: "Plan your personal loan repayments" },
      { id: "car-loan", name: "Car Loan Calculator", description: "Help with auto financing decisions" },
      {
        id: "loan-affordability",
        name: "Loan Affordability Calculator",
        description: "Find out how much loan you can afford",
      },
    ],
  },
  {
    title: "Goal-based Planning",
    icon: "📅",
    calculators: [
      {
        id: "retirement",
        name: "Retirement Planning Calculator",
        description: "Plan your retirement corpus and savings",
      },
      {
        id: "education",
        name: "Child Education Planner",
        description: "Estimate future education costs with inflation",
      },
      { id: "wedding", name: "Wedding Goal Calculator", description: "Plan savings for wedding expenses" },
      { id: "dream-purchase", name: "Dream House/Car Purchase Planner", description: "Plan for your dream purchases" },
    ],
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">Financial Calculators</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Plan your financial future with our comprehensive suite of calculators for investments, loans, and goal-based
          planning.
        </p>
      </motion.div>

      {calculatorCategories.map((category, index) => (
        <motion.section
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="text-3xl">{category.icon}</span>
            <h2 className="text-2xl font-semibold">{category.title} Calculators</h2>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {category.calculators.map((calculator) => (
              <motion.div key={calculator.id} variants={item}>
                <Link href={`/dashboard/calculators/${calculator.id}`} className="block h-full">
                  <Card className="h-full transition-all hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {calculator.name}
                        <Calculator className="h-5 w-5" />
                      </CardTitle>
                      <CardDescription>{calculator.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-end">
                      <div className="text-sm flex items-center gap-1">
                        <span>Calculate now</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      ))}
    </main>
  )
}
