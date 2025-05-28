"use client"

import { useState, useRef } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { FiltersBar } from "@/components/dashboard/filters-bar"
import { ApplicationsList } from "@/components/dashboard/applications-list"
import { ApplicationDialog } from "@/components/dashboard/application-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, AlertTriangle, Sparkles, Clock, Zap, Filter } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useJobApplications } from "@/hooks/use-job-applications"
import { useJobApplicationsStore } from "@/store/job-applications-store"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import Link from "next/link"

export default function DashboardPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { user } = useAuth()
  const { remainingSlots, isDemo, canAddMore, hasActiveFilters, applications, allApplications } = useJobApplications()
  const { filters } = useJobApplicationsStore()
  const filtersBarRef = useRef<HTMLDivElement>(null)

  const activeFiltersCount = Object.keys(filters).length

  const handleFiltersCleared = () => {
    // Scroll to filters so user can see they were cleared
    filtersBarRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  return (
    <ErrorBoundary>
      <AppLayout>
        <div className="space-y-8">
          {/* Header with gradient */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-xl blur-xl"></div>
            <div className="relative bg-gradient-to-r from-white/80 to-blue-50/80 backdrop-blur-sm rounded-xl p-6 border border-white/40 shadow-lg">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                          Dashboard
                        </h1>
                        {hasActiveFilters && (
                          <span className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                            <Filter className="h-3 w-3" />
                            {activeFiltersCount} {activeFiltersCount === 1 ? "filtr" : "filtry"}
                            {applications.length !== allApplications.length && (
                              <span className="text-purple-600">
                                ({applications.length}/{allApplications.length})
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-blue-500" />
                        Zarządzaj swoimi aplikacjami o pracę z elegancją
                        {isDemo && (
                          <span className="ml-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 px-2 py-1 rounded-full text-xs font-medium">
                            <Clock className="h-3 w-3 inline mr-1" />
                            DEMO: {remainingSlots}/10 slotów
                          </span>
                        )}
                        {user && (
                          <span className="ml-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                            Zalogowany: {user.email}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => setIsDialogOpen(true)}
                    disabled={!canAddMore}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {canAddMore ? "Dodaj aplikację" : "Limit osiągnięty"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Demo mode information */}
          {!user && (
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/50 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center shadow-md">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-amber-800 flex items-center gap-2">
                      Tryb demonstracyjny
                      <span className="text-xs bg-amber-200 text-amber-700 px-2 py-1 rounded-full font-normal">
                        DEMO
                      </span>
                    </CardTitle>
                    <CardDescription className="text-amber-700">
                      Możesz dodać maksymalnie <strong>10 aplikacji</strong> bez rejestracji.{" "}
                      <span className="font-semibold">Pozostało: {remainingSlots} slotów</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Button
                  asChild
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-md"
                >
                  <Link href="/auth/login">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Zaloguj się dla pełnego dostępu
                  </Link>
                </Button>
                {remainingSlots === 0 && (
                  <Button asChild variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50">
                    <Link href="/auth/register">Utwórz konto</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          <StatsCards />
          <div ref={filtersBarRef}>
            <FiltersBar />
          </div>
          <ApplicationsList onFiltersCleared={handleFiltersCleared} />

          <ApplicationDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
        </div>
      </AppLayout>
    </ErrorBoundary>
  )
}
