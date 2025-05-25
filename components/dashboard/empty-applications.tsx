"use client"

import { EmptyState, type EmptyStateAction } from "@/components/ui/empty-state"
import { useJobApplicationsStore } from "@/store/job-applications-store"
import { Briefcase, Search, Filter } from "lucide-react"

interface EmptyApplicationsProps {
  isEmptyDueToFilters: boolean
  onAddApplication: () => void
  onFiltersCleared?: () => void
}

export function EmptyApplications({ isEmptyDueToFilters, onAddApplication, onFiltersCleared }: EmptyApplicationsProps) {
  const { setFilters } = useJobApplicationsStore()

  const handleClearFilters = () => {
    setFilters({})
    onFiltersCleared?.()
  }

  if (isEmptyDueToFilters) {
    const actions: EmptyStateAction[] = [
      {
        label: "Wyczyść filtry",
        icon: Filter,
        onClick: handleClearFilters,
        variant: "outline",
        className: "border-amber-300 text-amber-700 hover:bg-amber-100",
      },
      {
        label: "Dodaj aplikację",
        icon: Briefcase,
        onClick: onAddApplication,
        className: "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg",
      },
    ]

    return (
      <EmptyState
        icon={Search}
        title="Brak wyników wyszukiwania"
        description="Nie znaleziono aplikacji pasujących do aktualnych filtrów. Spróbuj zmienić kryteria wyszukiwania lub wyczyść filtry."
        actions={actions}
        variant="warning"
      />
    )
  }

  const actions: EmptyStateAction[] = [
    {
      label: "Dodaj pierwszą aplikację",
      icon: Briefcase,
      onClick: onAddApplication,
      className: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg",
    },
  ]

  return (
    <EmptyState
      icon={Briefcase}
      title="Brak aplikacji"
      description="Nie masz jeszcze żadnych aplikacji o pracę"
      actions={actions}
      variant="default"
    />
  )
}
