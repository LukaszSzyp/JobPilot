"use client"

import { useState } from "react"
import { useJobApplications } from "@/hooks/use-job-applications"
import type { JobApplication } from "@/types"
import { ApplicationDialog } from "./application-dialog"
import { ApplicationCard } from "./application-card"
import { EmptyApplications } from "./empty-applications"
import { ErrorBoundary } from "../ui/error-boundary"
import { LoadingSpinner } from "../ui/loading-spinner"

interface ApplicationsListProps {
  onFiltersCleared?: () => void
}

export function ApplicationsList({ onFiltersCleared }: ApplicationsListProps) {
  const { applications, delete: deleteApplication, isLoading, isEmptyDueToFilters } = useJobApplications()
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleEdit = (application: JobApplication) => {
    setEditingApplication(application)
    setIsDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingApplication(null)
  }

  const handleAddApplication = () => {
    setIsDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <LoadingSpinner size="lg" text="Ładowanie aplikacji..." />
      </div>
    )
  }

  if (applications.length === 0) {
    return (
      <>
        <EmptyApplications
          isEmptyDueToFilters={isEmptyDueToFilters}
          onAddApplication={handleAddApplication}
          onFiltersCleared={onFiltersCleared}
        />
        <ApplicationDialog application={editingApplication} open={isDialogOpen} onOpenChange={handleDialogClose} />
      </>
    )
  }

  return (
    <ErrorBoundary>
      <div className="space-y-4">
        {applications.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            onEdit={handleEdit}
            onDelete={deleteApplication}
          />
        ))}
      </div>

      <ApplicationDialog application={editingApplication} open={isDialogOpen} onOpenChange={handleDialogClose} />
    </ErrorBoundary>
  )
}
