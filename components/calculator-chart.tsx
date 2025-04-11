"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Chart, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AreaChart, BarChart, PieChart } from "@/components/ui/chart"

interface CalculatorChartProps {
  calculatorId: string
  results: any
}

export function CalculatorChart({ calculatorId, results }: CalculatorChartProps) {
  // Different chart types based on calculator
  switch (calculatorId) {
    case "sip":
    case "ppf":
    case "fd":
      return <GrowthChart data={results.yearlyData} />
    case "home-loan":
      return <LoanBreakdownChart data={results} />
    case "retirement":
      return <RetirementChart data={results} />
    default:
      return (
        <Card>
          <CardContent className="p-6 h-[400px] flex items-center justify-center">
            <p>Chart visualization not available for this calculator</p>
          </CardContent>
        </Card>
      )
  }
}

function GrowthChart({ data }: { data: any[] }) {
  return (
    <Card>
      <CardContent className="p-6">
        <ChartContainer className="h-[400px]">
          <Chart>
            <AreaChart
              data={data}
              index="year"
              categories={["totalInvestment", "totalValue"]}
              colors={["neutral", "primary"]}
              valueFormatter={(value) => `₹${value.toLocaleString()}`}
              showAnimation
            />
            <ChartTooltip>
              <ChartTooltipContent />
            </ChartTooltip>
          </Chart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

function LoanBreakdownChart({ data }: { data: any }) {
  const pieData = [
    { name: "Principal", value: data.principal },
    { name: "Interest", value: data.totalInterest },
  ]

  return (
    <Card>
      <CardContent className="p-6">
        <ChartContainer className="h-[400px]">
          <Chart>
            <PieChart
              data={pieData}
              index="name"
              categories={["value"]}
              colors={["primary", "destructive"]}
              valueFormatter={(value) => `₹${value.toLocaleString()}`}
              showAnimation
            />
            <ChartTooltip>
              <ChartTooltipContent />
            </ChartTooltip>
          </Chart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

function RetirementChart({ data }: { data: any }) {
  return (
    <Card>
      <CardContent className="p-6">
        <ChartContainer className="h-[400px]">
          <Chart>
            <BarChart
              data={data.yearlyData}
              index="age"
              categories={["corpus"]}
              colors={["primary"]}
              valueFormatter={(value) => `₹${value.toLocaleString()}`}
              showAnimation
            />
            <ChartTooltip>
              <ChartTooltipContent />
            </ChartTooltip>
          </Chart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
