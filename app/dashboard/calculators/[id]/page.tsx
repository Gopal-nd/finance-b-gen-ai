"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Calculator, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { calculatorConfig } from "@/lib/calculator-config"
import { CalculatorResults } from "@/components/calculator-results"

export default function CalculatorPage() {
  const router = useRouter()
  const { id } = useParams()
  const calculatorId = Array.isArray(id) ? id[0] : id

  const calculator = calculatorConfig[calculatorId as string] 

  const [formValues, setFormValues] = useState(calculator?.defaultValues || {})
  const [calculationDone, setCalculationDone] = useState(false)
  const [calculatorFound, setCalculatorFound] = useState(!!calculator)

  useEffect(() => {
    setCalculatorFound(!!calculator)
    setFormValues(calculator?.defaultValues || {})
  }, [calculator])

  if (!calculatorFound) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Calculator not found</h1>
        <Button onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Calculators
        </Button>
      </div>
    )
  }

  const handleInputChange = (field: string, value: number) => {
    setFormValues((prev) => ({ ...prev, [field]: value }))
    setCalculationDone(false)
  }

  const handleCalculate = () => {
    setCalculationDone(true)
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
        <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Calculators
        </Button>

        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{calculator.icon}</span>
          <h1 className="text-3xl font-bold">{calculator.name}</h1>
        </div>
        <p className="text-lg">{calculator.description}</p>
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
                Input Parameters
              </CardTitle>
              <CardDescription>Adjust the values to calculate your results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {calculator.fields.map((field:any) => (
                <div key={field.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={field.id} className="flex items-center gap-1">
                      {field.label}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{field.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <div className="flex items-center gap-2">
                      {field.prefix && <span className="text-sm text-muted-foreground">{field.prefix}</span>}
                      <Input
                        id={field.id}
                        type="number"
                        value={formValues[field.id]}
                        onChange={(e) => handleInputChange(field.id, Number.parseFloat(e.target.value) || 0)}
                        className="w-24 text-right"
                      />
                      {field.suffix && <span className="text-sm text-muted-foreground">{field.suffix}</span>}
                    </div>
                  </div>
                  <Slider
                    value={[formValues[field.id]]}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    onValueChange={(value) => handleInputChange(field.id, value[0])}
                  />
                </div>
              ))}

              <Button className="w-full mt-4" onClick={handleCalculate}>
                Calculate
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
          <Tabs defaultValue="results">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="results" className="mt-4">
                <CalculatorResults calculatorId={calculatorId as string} values={formValues} showResults={calculationDone} />
              </TabsContent>


              <TabsContent value="details" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Breakdown</CardTitle>
                    <CardDescription>Year-by-year or period-by-period breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {calculationDone ? (
                      <CalculatorResults
                        calculatorId={calculatorId as string}
                        values={formValues}
                        showResults={calculationDone}
                        viewType="details"
                      />
                    ) : (
                      <div className="h-[400px] flex items-center justify-center">
                        <p className="text-muted-foreground">Click Calculate to see detailed breakdown</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
