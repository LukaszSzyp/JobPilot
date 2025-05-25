import { create } from "zustand"
import type { JobApplication, JobApplicationFilters } from "@/types"

interface JobApplicationsState {
  applications: JobApplication[]
  filters: JobApplicationFilters
  sortBy: "application_date" | "company_name" | "position_title" | "status"
  sortOrder: "asc" | "desc"
  setApplications: (applications: JobApplication[]) => void
  addApplication: (application: JobApplication) => void
  updateApplication: (id: string, updates: Partial<JobApplication>) => void
  removeApplication: (id: string) => void
  setFilters: (filters: JobApplicationFilters) => void
  setSorting: (sortBy: string, sortOrder: "asc" | "desc") => void
}

export const useJobApplicationsStore = create<JobApplicationsState>((set) => ({
  applications: [],
  filters: {},
  sortBy: "application_date",
  sortOrder: "desc",
  setApplications: (applications) => set({ applications }),
  addApplication: (application) => set((state) => ({ applications: [...state.applications, application] })),
  updateApplication: (id, updates) =>
    set((state) => ({
      applications: state.applications.map((app) => (app.id === id ? { ...app, ...updates } : app)),
    })),
  removeApplication: (id) =>
    set((state) => ({
      applications: state.applications.filter((app) => app.id !== id),
    })),
  setFilters: (filters) => set({ filters }),
  setSorting: (sortBy, sortOrder) => set({ sortBy, sortOrder }),
}))
