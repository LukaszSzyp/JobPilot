"use client"

import { useQuery } from "@tanstack/react-query"
import { RepositoryFactory } from "@/factories/repository-factory"
import { useJobApplicationsStore } from "@/store/job-applications-store"
import { useAuthStore } from "@/store/auth-store"
import { useCrudOperations } from "./use-crud-operations"
import { useEffect } from "react"

export const useJobApplications = () => {
  const { filters, setApplications } = useJobApplicationsStore()
  const { user } = useAuthStore()
  const isDemo = !user

  // Factory creates appropriate repository based on auth state
  const repository = RepositoryFactory.createJobApplicationRepository(isDemo)

  // Initialize demo data synchronously for demo mode
  useEffect(() => {
    if (isDemo && typeof window !== "undefined") {
      // Import and initialize demo data synchronously
      import("@/services/demo-data-service").then(({ DemoDataService }) => {
        DemoDataService.initializeSampleData()
      })
    }
  }, [isDemo])

  // Query for all applications (unfiltered)
  const { data: allApplications = [] } = useQuery({
    queryKey: ["job-applications-all", user?.id],
    queryFn: () => repository.getAll(),
    enabled: typeof window !== "undefined", // Client-side only
  })

  // Query for filtered applications
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["job-applications", filters, user?.id],
    queryFn: () => repository.getAll(filters),
    onSuccess: setApplications,
    enabled: typeof window !== "undefined", // Client-side only
  })

  // Query for statistics
  const { data: stats } = useQuery({
    queryKey: ["job-applications-stats", user?.id],
    queryFn: () => repository.getStats(),
    enabled: typeof window !== "undefined", // Client-side only
  })

  // CRUD operations using the repository
  const crud = useCrudOperations(
    {
      create: repository.create.bind(repository),
      update: repository.update.bind(repository),
      delete: repository.delete.bind(repository),
    },
    {
      queryKeys: [["job-applications"], ["job-applications-all"], ["job-applications-stats"]],
    },
  )

  // Business logic calculations
  const hasActiveFilters = Object.keys(filters).length > 0
  const isEmptyDueToFilters = applications.length === 0 && allApplications.length > 0 && hasActiveFilters
  const remainingSlots = isDemo ? Math.max(0, 10 - allApplications.length) : Number.POSITIVE_INFINITY
  const canAddMore = !isDemo || remainingSlots > 0

  return {
    applications,
    allApplications,
    stats,
    isLoading,
    hasActiveFilters,
    isEmptyDueToFilters,
    remainingSlots,
    isDemo,
    canAddMore,
    ...crud,
  }
}
