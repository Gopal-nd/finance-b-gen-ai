"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Goal } from "lucide-react"
import { toast } from "sonner"

// Types
export interface Goal {
  id: string
  name: string
  emoji: string
  targetAmount: number
  durationMonths: number
  monthlySIP: number
  suggestedPlan: string
  reasoning: string
  createdAt: string
  isCompleted: boolean
  progress: number
  progressData?: ProgressItem[]
  chatMessages?: ChatMessage[]
}

export interface ProgressItem {
  id: string
  month: string
  completed: boolean
  paymentDate?: string
}

export interface ChatMessage {
  id: string
  question: string
  response: string
  createdAt: string
}

// API functions
async function fetchGoals(): Promise<Goal[]> {
  const response = await fetch("/api/goals")
  console.log("",response.body)
  if (!response.ok) {
    throw new Error("Failed to fetch goals")
  }
  return response.json()
}

async function fetchGoal(id: string): Promise<Goal> {
  const response = await fetch(`/api/goals/${id}`)
  if (!response.ok) {
    throw new Error("Failed to fetch goal")
  }
  return response.json()
}

async function createGoal(goal: Partial<Goal>): Promise<Goal> {
  const response = await fetch("/api/goals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(goal),
  })
  if (!response.ok) {
    throw new Error("Failed to create goal")
  }
  return response.json()
}

async function updateGoal(id: string, goal: Partial<Goal>): Promise<Goal> {
  const response = await fetch(`/api/goals/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(goal),
  })
  if (!response.ok) {
    throw new Error("Failed to update goal")
  }
  return response.json()
}

async function deleteGoal(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`/api/goals/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete goal")
  }
  return response.json()
}

async function sendChatMessage(goalId: string, question: string): Promise<ChatMessage> {
  const response = await fetch(`/api/goals/${goalId}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  })
  if (!response.ok) {
    throw new Error("Failed to send message")
  }
  return response.json()
}

async function updateProgress(
  goalId: string,
  progressId: string,
  completed: boolean,
): Promise<{ progress: ProgressItem; overallProgress: number }> {
  const response = await fetch(`/api/goals/${goalId}/progress`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ progressId, completed }),
  })
  if (!response.ok) {
    throw new Error("Failed to update progress")
  }
  return response.json()
}

// React Query Hooks
export function useGoals() {
  return useQuery({
    queryKey: ["goals"],
    queryFn: fetchGoals,
  })
}

export function useGoal(id: string) {
  return useQuery({
    queryKey: ["goal", id],
    queryFn: () => fetchGoal(id),
    enabled: !!id,
  })
}

export function useCreateGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] })
    toast.success('Goal created successfully!')
    },
    onError: (error) => {
        toast.error("Error: " + error.message)
    },
  })
}

export function useUpdateGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, goal }: { id: string; goal: Partial<Goal> }) => updateGoal(id, goal),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["goals"] })
      queryClient.invalidateQueries({ queryKey: ["goal", data.id] })
      toast.success("Goal updated successfully!")
    },
    onError: (error) => {
        toast.error("Error: " + error.message)
    },
  })
}

export function useDeleteGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] })
toast.success('Goal deleted successfully!')
    },
    onError: (error) => {
toast.error("Error: " + error.message)
    },
  })
}

export function useSendChatMessage(goalId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (question: string) => sendChatMessage(goalId, question),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goal", goalId] })
    },
    onError: (error) => {
        toast.error("Error: " + error.message)

    },
  })
}

export function useUpdateProgress(goalId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ progressId, completed }: { progressId: string; completed: boolean }) =>
      updateProgress(goalId, progressId, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goal", goalId] })
      queryClient.invalidateQueries({ queryKey: ["goals"] })
    },
    onError: (error) => {
        toast.error("Error: " + error.message)

    },
  })
}
