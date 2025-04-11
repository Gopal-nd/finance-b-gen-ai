"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import {
  calculateSIP,
  calculatePPF,
  calculateFD,
  calculateHomeLoan,
  calculateRetirement,
} from "@/lib/calculator-functions"
import { CalculatorChart } from "@/components/calculator-chart"
import { CalculatorDetailsTable } from "@/components/calculator-details-table"
import { CalculatorSummary } from "@/components/calculator-summary"

interface CalculatorResultsProps {
  calculatorId: string
  values: Record<string, number>
  showResults: boolean
  viewType?: "summary" | "chart" | "details"
}

export function CalculatorResults({ calculatorId, values, showResults, viewType = "summary" }: CalculatorResultsProps) {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!showResults) return

    setLoading(true)

    // Simulate calculation delay for better UX
    setTimeout(() => {
      let calculationResults

      switch (calculatorId) {
        case "sip":
          calculationResults = calculateSIP(values.monthlyInvestment, values.expectedReturn, values.timePeriod)
          break
        case "ppf":
          calculationResults = calculatePPF(values.yearlyInvestment, values.interestRate, values.timePeriod)
          break
        case "fd":
          calculationResults = calculateFD(values.principal, values.interestRate, values.timePeriod)
          break
        case "home-loan":
          calculationResults = calculateHomeLoan(values.loanAmount, values.interestRate, values.loanTenure)
          break
        case "retirement":
          calculationResults = calculateRetirement(
            values.currentAge,
            values.retirementAge,
            values.monthlyExpenses,
            values.inflation,
            values.returnRate,
            values.lifeExpectancy,
          )
          break
        default:
          calculationResults = { error: "Calculator not implemented" }
      }

      setResults(calculationResults)
      setLoading(false)
    }, 500)
  }, [calculatorId, values, showResults])

  if (!showResults) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-[300px] flex flex-col items-center justify-center text-center">
            <p className="text-lg mb-4">Adjust the parameters and click Calculate to see your results</p>
            <p className="text-sm text-muted-foreground">
              The results will appear here with detailed visualizations and breakdowns
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-[300px] flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 border-4 border-t-primary rounded-full animate-spin mb-4"></div>
              <p>Calculating your results...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!results) {
    return null
  }

  if (results.error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-[300px] flex items-center justify-center">
            <p>Error: {results.error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {viewType === "summary" && <CalculatorSummary calculatorId={calculatorId} results={results} />}
      {viewType === "chart" && <CalculatorChart calculatorId={calculatorId} results={results} />}
      {viewType === "details" && <CalculatorDetailsTable calculatorId={calculatorId} results={results} />}
    </motion.div>
  )
}
