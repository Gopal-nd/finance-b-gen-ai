"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Calendar, Filter, Plus, SortAsc, SortDesc, Target, Check, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { useGoals } from "@/hooks/use-goals"
import { useGoalsStore } from "@/store/goals-store"

export default function GoalsPage() {
  const { data: goals, isLoading, error } = useGoals()
  const { filterCompleted, setFilterCompleted, sortBy, setSortBy, sortDirection, setSortDirection } = useGoalsStore()

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

  // Filter and sort goals
  const filteredAndSortedGoals = goals
    ? goals
        .filter((goal) => (filterCompleted ? true : !goal.isCompleted))
        .sort((a, b) => {
          if (sortDirection === "asc") {
            return a[sortBy] > b[sortBy] ? 1 : -1
          } else {
            return a[sortBy] < b[sortBy] ? 1 : -1
          }
        })
    : []

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold">Your Financial Goals</h1>
          <p className="text-muted-foreground mt-1">Track and manage your savings objectives</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter & Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="flex items-center justify-between cursor-pointer">
                  <span>Show completed goals</span>
                  <Switch checked={filterCompleted} onCheckedChange={setFilterCompleted} />
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setSortBy("createdAt")}
                >
                  <span>Date created</span>
                  {sortBy === "createdAt" && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setSortBy("targetAmount")}
                >
                  <span>Target amount</span>
                  {sortBy === "targetAmount" && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setSortBy("progress")}
                >
                  <span>Progress</span>
                  {sortBy === "progress" && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setSortBy("durationMonths")}
                >
                  <span>Duration</span>
                  {sortBy === "durationMonths" && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
              >
                <span>Order</span>
                {sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/dashboard/goals/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Create New Goal</span>
            </Button>
          </Link>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-2 w-full" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-destructive/20 mb-4">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Error loading goals</h2>
          <p className="text-muted-foreground mb-6">There was a problem loading your goals. Please try again.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      ) : filteredAndSortedGoals.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredAndSortedGoals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <Link href={`/dashboard/goals/${goal.id}`} className="block h-full">
                <Card
                  className={`h-full transition-all hover:shadow-md overflow-hidden ${
                    goal.isCompleted ? "bg-muted/50 border-muted" : ""
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-xl">{goal.emoji}</span>
                        {goal.name}
                      </CardTitle>
                      {goal.isCompleted && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Completed</span>
                      )}
                    </div>
                    <CardDescription>Created on {formatDate(goal.createdAt)}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
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

                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full flex items-center justify-center gap-1">
                      <span>View Details</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
            <Target className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No goals created yet</h2>
          <p className="text-muted-foreground mb-6">Create your first financial goal to start tracking your progress</p>
          <Link href="/dashboard/goals/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Your First Goal
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
