"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Calculator, Check, HelpCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"

const goalEmojis = [
  { value: "🏠", label: "Home" },
  { value: "🚗", label: "Car" },
  { value: "✈️", label: "Travel" },
  { value: "🎓", label: "Education" },
  { value: "💍", label: "Wedding" },
  { value: "👶", label: "Child" },
  { value: "🏥", label: "Health" },
  { value: "🏦", label: "Retirement" },
  { value: "💰", label: "Other" },
]

export default function NewGoalPage() {
  const router = useRouter()
  const [formValues, setFormValues] = useState({
    name: "",
    emoji: "💰",
    targetAmount: 100000,
    durationMonths: 36,
  })
  const [isCalculating, setIsCalculating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [calculationResult, setCalculationResult] = useState<any>(null)

  const handleInputChange = (field: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [field]: value }))
    setCalculationResult(null)
  }

  const handleCalculate = () => {
    if (!formValues.name) {
        toast.warning('Please enter a name for your goal. or Missing Information')
      return
    }

    setIsCalculating(true)

    // Simulate calculation delay
    setTimeout(() => {
      const monthlySIP = Math.round(formValues.targetAmount / formValues.durationMonths)
      const suggestedPlan = getSuggestedPlan(formValues.durationMonths)
      const reasoning = getPlanReasoning(formValues.durationMonths)

      setCalculationResult({
        monthlySIP,
        suggestedPlan,
        reasoning,
      })

      setIsCalculating(false)
    }, 1500)
  }

  const handleSubmit = async () => {
    if (!formValues.name || !calculationResult) {
      toast.warning('Please enter a name for your goal. or Missing Information')
      return
    }

    setIsSubmitting(true)

    try {
    //   In a real app, you would call your API here
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formValues,
          ...calculationResult,
        }),
      });
      const data = await response.json();

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast.success("Goal created successfully!")

      router.push("/dashboard/goals")
    } catch (error:any) {
      console.error("Error creating goal:", error)
        toast.error("Error: " + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getSuggestedPlan = (durationMonths: number) => {
    if (durationMonths <= 12) {
      return "Debt Funds and Fixed Deposits"
    } else if (durationMonths <= 36) {
      return "Balanced Mutual Fund Portfolio"
    } else {
      return "Equity-oriented Mutual Funds"
    }
  }

  const getPlanReasoning = (durationMonths: number) => {
    if (durationMonths <= 12) {
      return "For short-term goals under 1 year, capital protection is crucial. Debt funds and fixed deposits provide stability and predictable returns, ensuring your funds are ready when you need them without market risk."
    } else if (durationMonths <= 36) {
      return "For medium-term goals of 1-3 years, a balanced approach with a mix of debt and equity mutual funds provides stability while allowing for growth to beat inflation. This approach balances risk and returns for your goal."
    } else {
      return "With a long-term horizon over 3 years, equity-oriented mutual funds can provide higher returns to build your corpus effectively. The longer time frame allows for riding out market volatility while maximizing growth potential."
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
        <Button variant="ghost" onClick={() => router.push("/goals")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Goals
        </Button>

        <h1 className="text-3xl font-bold">Create New Financial Goal</h1>
        <p className="text-muted-foreground">Set up a new savings goal and get a personalized investment plan</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Goal Parameters
              </CardTitle>
              <CardDescription>Define your financial goal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Goal Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Down Payment for Home"
                  value={formValues.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emoji">Goal Icon</Label>
                <Select value={formValues.emoji} onValueChange={(value) => handleInputChange("emoji", value)}>
                  <SelectTrigger id="emoji">
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {goalEmojis.map((emoji) => (
                      <SelectItem key={emoji.value} value={emoji.value}>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{emoji.value}</span>
                          <span>{emoji.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="targetAmount" className="flex items-center gap-1">
                    Target Amount
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">The total amount you want to save for this goal</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">₹</span>
                    <Input
                      id="targetAmount"
                      type="number"
                      value={formValues.targetAmount}
                      onChange={(e) => handleInputChange("targetAmount", Number(e.target.value))}
                      className="w-24 text-right"
                    />
                  </div>
                </div>
                <Slider
                  value={[formValues.targetAmount]}
                  min={10000}
                  max={10000000}
                  step={10000}
                  onValueChange={(value) => handleInputChange("targetAmount", value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹10,000</span>
                  <span>₹1,00,00,000</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="durationMonths" className="flex items-center gap-1">
                    Duration (Months)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">How long you plan to save for this goal</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="durationMonths"
                      type="number"
                      value={formValues.durationMonths}
                      onChange={(e) => handleInputChange("durationMonths", Number(e.target.value))}
                      className="w-24 text-right"
                    />
                    <span className="text-sm text-muted-foreground">months</span>
                  </div>
                </div>
                <Slider
                  value={[formValues.durationMonths]}
                  min={1}
                  max={120}
                  step={1}
                  onValueChange={(value) => handleInputChange("durationMonths", value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 month</span>
                  <span>10 years</span>
                </div>
              </div>

              <Button className="w-full mt-4" onClick={handleCalculate} disabled={isCalculating}>
                {isCalculating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Calculating...
                  </>
                ) : (
                  <>Calculate Plan</>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Investment Plan</CardTitle>
              <CardDescription>Your personalized savings and investment strategy</CardDescription>
            </CardHeader>
            <CardContent>
              {calculationResult ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-lg border">
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Required Monthly SIP</h3>
                      <p className="text-3xl font-bold">{formatCurrency(calculationResult.monthlySIP)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Monthly investment needed to reach your target
                      </p>
                    </div>
                    <div className="p-6 rounded-lg border">
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Suggested Investment</h3>
                      <p className="text-xl font-bold">{calculationResult.suggestedPlan}</p>
                      <p className="text-xs text-muted-foreground mt-1">Recommended investment type</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted">
                    <h3 className="text-sm font-medium mb-2">Investment Reasoning</h3>
                    <p className="text-sm">{calculationResult.reasoning}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any personal notes or reminders about this goal..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-center">
                  <p className="text-lg mb-4">Fill in your goal details and click Calculate</p>
                  <p className="text-sm text-muted-foreground">
                    We'll generate a personalized investment plan based on your inputs
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => router.push("/goals")}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!calculationResult || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Save Goal
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
