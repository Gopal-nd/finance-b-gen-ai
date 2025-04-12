"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { useUpdateProgress } from "@/hooks/use-goals"

interface ProgressItem {
  id: string
  month: string
  completed: boolean
  paymentDate?: string
}

interface GoalProgressTrackerProps {
  progressData: ProgressItem[]
  goalId: string
}

export function GoalProgressTracker({ progressData, goalId }: GoalProgressTrackerProps) {
  const [progress, setProgress] = useState<ProgressItem[]>(progressData || [])
  const { mutate: updateProgress, isPending: isUpdating } = useUpdateProgress(goalId)

  useEffect(() => {
    if (progressData) {
      setProgress(progressData)
    }
  }, [progressData])

  const handleToggleProgress = async (index: number) => {
    if (isUpdating) return

    const progressItem = progress[index]
    const newCompleted = !progressItem.completed

    // Optimistically update the UI
    const newProgress = [...progress]
    newProgress[index].completed = newCompleted
    setProgress(newProgress)

    // Update the backend
    updateProgress(
      { progressId: progressItem.id, completed: newCompleted },
      {
        onError: () => {
          // Revert on error
          const revertProgress = [...progress]
          revertProgress[index].completed = !newCompleted
          setProgress(revertProgress)

          toast("Error updating payment status")
        },
        onSuccess: () => {
          toast("SIP payment marked as complete")
        },
      },
    )
  }

  const completedCount = progress.filter((item) => item.completed).length
  const totalCount = progress.length
  const completionPercentage = Math.round((completedCount / totalCount) * 100)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">
            {completedCount} of {totalCount} payments completed
          </p>
          <p className="text-xs text-muted-foreground">Track your monthly SIP payments</p>
        </div>
        <div className="text-2xl font-bold">{completionPercentage}%</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {progress.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 border rounded-lg flex items-center justify-between ${
              item.completed ? "border-primary/30 bg-primary/5" : "border-muted"
            }`}
          >
            <div className="flex items-center gap-3">
              <Checkbox
                checked={item.completed}
                onCheckedChange={() => handleToggleProgress(index)}
                disabled={isUpdating}
              />
              <div>
                <p className="text-sm font-medium">{item.month}</p>
                <p className="text-xs text-muted-foreground">Monthly SIP</p>
              </div>
            </div>
            {item.completed ? (
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                <Check className="h-3 w-3 text-primary" />
              </div>
            ) : (
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                <X className="h-3 w-3 text-muted-foreground" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
