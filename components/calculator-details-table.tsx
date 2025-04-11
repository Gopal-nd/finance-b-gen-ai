"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface CalculatorDetailsTableProps {
  calculatorId: string
  results: any
}

export function CalculatorDetailsTable({ calculatorId, results }: CalculatorDetailsTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const renderTable = () => {
    switch (calculatorId) {
      case "sip":
      case "ppf":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead>Investment Amount</TableHead>
                <TableHead>Interest Earned</TableHead>
                <TableHead>Total Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.yearlyData.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{item.year}</TableCell>
                  <TableCell>{formatCurrency(item.totalInvestment)}</TableCell>
                  <TableCell>{formatCurrency(item.totalValue - item.totalInvestment)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(item.totalValue)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )

      case "fd":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead>Principal</TableHead>
                <TableHead>Interest Earned</TableHead>
                <TableHead>Value at End of Year</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.yearlyData.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{item.year}</TableCell>
                  <TableCell>{formatCurrency(results.principal)}</TableCell>
                  <TableCell>{formatCurrency(item.interestEarned)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(item.value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )

      case "home-loan":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead>Principal Paid</TableHead>
                <TableHead>Interest Paid</TableHead>
                <TableHead>Outstanding Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.yearlyData.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{item.year}</TableCell>
                  <TableCell>{formatCurrency(item.principalPaid)}</TableCell>
                  <TableCell>{formatCurrency(item.interestPaid)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(item.outstandingBalance)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )

      case "retirement":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Age</TableHead>
                <TableHead>Yearly Investment</TableHead>
                <TableHead>Corpus Value</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.yearlyData.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{item.age}</TableCell>
                  <TableCell>{item.isRetired ? "-" : formatCurrency(item.yearlyInvestment)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(item.corpus)}</TableCell>
                  <TableCell>{item.isRetired ? "Retired" : "Accumulation"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )

      default:
        return (
          <div className="p-6 text-center">
            <p>Detailed breakdown not available for this calculator</p>
          </div>
        )
    }
  }

  return (
    <Card>
      <CardContent className="p-6 overflow-auto max-h-[500px]">{renderTable()}</CardContent>
    </Card>
  )
}
