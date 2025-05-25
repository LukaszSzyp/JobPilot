"use client"

import { useJobApplications } from "@/hooks/use-job-applications"
import { StatsCardsServer } from "./stats-cards-server"

export function StatsCards() {
  const { stats, isLoading } = useJobApplications()

  if (isLoading || !stats) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/60 backdrop-blur-sm border-white/20 rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  return <StatsCardsServer stats={stats} />
}
