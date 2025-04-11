"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, TrendingUp, Wallet, Calendar, PiggyBank } from "lucide-react"

interface CalculatorSummaryProps {
  calculatorId: string
  results: any
}

export function CalculatorSummary({ calculatorId, results }: CalculatorSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const renderSummaryCards = () => {
    switch (calculatorId) {
      case "sip":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SummaryCard
              title="Total Investment"
              value={formatCurrency(results.totalInvestment)}
              icon={<Wallet className="h-5 w-5" />}
              description="Amount you've invested"
            />
            <SummaryCard
              title="Total Returns"
              value={formatCurrency(results.totalReturns)}
              icon={<TrendingUp className="h-5 w-5" />}
              description="Interest earned on your investment"
              highlight
            />
            <SummaryCard
              title="Maturity Value"
              value={formatCurrency(results.maturityValue)}
              icon={<PiggyBank className="h-5 w-5" />}
              description="Final value of your investment"
            />
          </div>
        )

      case "ppf":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SummaryCard
              title="Total Investment"
              value={formatCurrency(results.totalInvestment)}
              icon={<Wallet className="h-5 w-5" />}
              description="Amount you've invested"
            />
            <SummaryCard
              title="Total Interest"
              value={formatCurrency(results.totalInterest)}
              icon={<TrendingUp className="h-5 w-5" />}
              description="Interest earned on your investment"
              highlight
            />
            <SummaryCard
              title="Maturity Value"
              value={formatCurrency(results.maturityValue)}
              icon={<PiggyBank className="h-5 w-5" />}
              description="Final value of your investment"
            />
          </div>
        )

      case "fd":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SummaryCard
              title="Principal Amount"
              value={formatCurrency(results.principal)}
              icon={<Wallet className="h-5 w-5" />}
              description="Amount you've invested"
            />
            <SummaryCard
              title="Interest Earned"
              value={formatCurrency(results.interestEarned)}
              icon={<TrendingUp className="h-5 w-5" />}
              description="Interest earned on your deposit"
              highlight
            />
            <SummaryCard
              title="Maturity Value"
              value={formatCurrency(results.maturityValue)}
              icon={<PiggyBank className="h-5 w-5" />}
              description="Final value at maturity"
            />
          </div>
        )

      case "home-loan":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SummaryCard
              title="Monthly EMI"
              value={formatCurrency(results.emi)}
              icon={<Calendar className="h-5 w-5" />}
              description="Your monthly installment"
              highlight
            />
            <SummaryCard
              title="Total Interest"
              value={formatCurrency(results.totalInterest)}
              icon={<TrendingUp className="h-5 w-5" />}
              description="Total interest payable"
            />
            <SummaryCard
              title="Total Payment"
              value={formatCurrency(results.totalPayment)}
              icon={<Wallet className="h-5 w-5" />}
              description="Principal + Interest"
            />
          </div>
        )

      case "retirement":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SummaryCard
              title="Retirement Corpus Needed"
              value={formatCurrency(results.corpusNeeded)}
              icon={<PiggyBank className="h-5 w-5" />}
              description="Total amount needed at retirement"
            />
            <SummaryCard
              title="Monthly Investment Needed"
              value={formatCurrency(results.monthlyInvestmentNeeded)}
              icon={<Calendar className="h-5 w-5" />}
              description="Amount to invest monthly"
              highlight
            />
            <SummaryCard
              title="Monthly Pension"
              value={formatCurrency(results.monthlyPension)}
              icon={<Wallet className="h-5 w-5" />}
              description="Estimated monthly income after retirement"
            />
          </div>
        )

      default:
        return (
          <div className="p-6 text-center">
            <p>Summary not available for this calculator</p>
          </div>
        )
    }
  }

  return (
    <Card>
      <CardContent className="p-6">{renderSummaryCards()}</CardContent>
    </Card>
  )
}

interface SummaryCardProps {
  title: string
  value: string
  icon: React.ReactNode
  description: string
  highlight?: boolean
}

function SummaryCard({ title, value, icon, description, highlight = false }: SummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-6 rounded-lg border ${highlight ? "border-primary/20" : "border-border"}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-full ${highlight ? "bg-primary/10" : "bg-muted"}`}>{icon}</div>
        {highlight && <ArrowUpRight className="h-5 w-5 text-primary" />}
      </div>
      <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
      <p className={`text-2xl font-bold ${highlight ? "text-primary" : ""}`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </motion.div>
  )
}
