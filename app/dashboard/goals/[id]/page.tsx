"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, PiggyBank, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from "@tanstack/react-query"

export default function GoalDetailPage() {
  const router = useRouter()
  const params = useParams() 
  const goalId = params.id


  const [activeTab, setActiveTab] = useState("overview")

  const { data: goal, isLoading } = useQuery({
    queryKey: ["goal", goalId],
    queryFn: async () => {
      const response = await fetch(`/api/goals/${goalId}`)
      return response.json()
    },
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }



  const storageKey = `goal-progress-${goalId}`
  const [progress, setProgress] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey)
      return stored ? Number.parseInt(stored) : goal?.progress || 0
    }
    return goal?.progress || 0
  })

  useEffect(() => {
    if (goal && typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        setProgress(Number.parseInt(stored))
      } else {
        setProgress(goal.progress)
      }
    }
  }, [goal, storageKey])

  const handleIncreaseProgress = () => {
    // Calculate the increment based on monthly progress
    const increment = Math.ceil(100 / goal.durationMonths)
    const newProgress = Math.min(progress + increment, 100)
    setProgress(newProgress)

    // Store in local storage
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, newProgress.toString())
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/goals")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Goals
          </Button>
          <Skeleton className="h-8 w-3/4 max-w-md mb-2" />
          <Skeleton className="h-4 w-1/2 max-w-sm" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Skeleton className="h-[400px] w-full" />
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!goal) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Goal not found</h1>
        <Button onClick={() => router.push("/dashboard/goals")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Goals
        </Button>
      </div>
    )
  }

  return (
    // <div>
    //       <GoalCard goal={data} />
    // </div>
    <div className="container mx-auto py-10 px-4 md:px-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <Button variant="ghost" onClick={() => router.push("/dashboard/goals")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Goals
          </Button>
        </div>

        <div className="flex flex-1 items-center w-full gap-3 mb-2">
          <span className="text-3xl">{goal.emoji}</span>
          <h1 className="text-3xl font-bold">{goal.name}</h1>
        </div>
        <p className="text-muted-foreground">
          Created on {formatDate(goal.createdAt)} • {goal.progress}% Complete
        </p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1  gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PiggyBank className="h-5 w-5" />
                Goal Summary
              </CardTitle>
              <CardDescription>Key details about your financial goal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="text-sm font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <Button onClick={handleIncreaseProgress} className="w-full mt-2" variant="outline">
                  Add Monthly Progress
                </Button>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-muted-foreground">Target Amount</span>
                <span className="font-medium">{formatCurrency(goal.targetAmount)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Monthly SIP</span>
                <span className="font-medium">{formatCurrency(goal.monthlySIP)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Duration</span>
                <span className="font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {goal.durationMonths} months
                </span>
              </div>

              <div className="pt-2 border-t">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" /> Suggested Investment Plan
                </h4>
                <p className="text-sm font-medium">{goal.suggestedPlan}</p>
                <p className="text-xs text-muted-foreground mt-2">{goal.reasoning}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        ></motion.div>
      </div>
    </div>
  )
}
