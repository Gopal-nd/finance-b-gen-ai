import { create } from "zustand"
import { persist } from "zustand/middleware"

interface GoalsState {
  activeGoalId: string | null
  setActiveGoalId: (id: string | null) => void

  filterCompleted: boolean
  setFilterCompleted: (value: boolean) => void

  sortBy: "createdAt" | "targetAmount" | "progress" | "durationMonths"
  setSortBy: (value: "createdAt" | "targetAmount" | "progress" | "durationMonths") => void

  sortDirection: "asc" | "desc"
  setSortDirection: (value: "asc" | "desc") => void
}

export const useGoalsStore = create<GoalsState>()(
  persist(
    (set) => ({
      activeGoalId: null,
      setActiveGoalId: (id) => set({ activeGoalId: id }),

      filterCompleted: false,
      setFilterCompleted: (value) => set({ filterCompleted: value }),

      sortBy: "createdAt",
      setSortBy: (value) => set({ sortBy: value }),

      sortDirection: "desc",
      setSortDirection: (value) => set({ sortDirection: value }),
    }),
    {
      name: "goals-store",
    },
  ),
)
