"use client"

import { useState, useEffect } from "react"
import { useJobApplicationsStore } from "@/store/job-applications-store"
import type { ApplicationStatus } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Filter, Search, RotateCcw } from "lucide-react"

export function FiltersBar() {
  const { filters, setFilters } = useJobApplicationsStore()
  const [localFilters, setLocalFilters] = useState(filters)
  const [isExpanded, setIsExpanded] = useState(false)

  // Synchronize local state with global state when global changes
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleApplyFilters = () => {
    setFilters(localFilters)
  }

  const handleResetFilters = () => {
    const emptyFilters = {}
    setLocalFilters(emptyFilters)
    setFilters(emptyFilters)
  }

  const hasActiveFilters = Object.keys(filters).length > 0

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-white/40 shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
              <Filter className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="font-semibold text-gray-900">Filtry wyszukiwania</span>
              {hasActiveFilters && (
                <span className="ml-2 text-sm bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-2 py-1 rounded-full">
                  {Object.keys(filters).length} aktywne
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="border-purple-200 hover:bg-purple-50"
            >
              <Search className="mr-2 h-4 w-4" />
              {isExpanded ? "Zwiń" : "Rozwiń"}
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
                  Status
                </Label>
                <Select
                  value={localFilters.status || ""}
                  onValueChange={(value: ApplicationStatus | "") =>
                    setLocalFilters({ ...localFilters, status: value || undefined })
                  }
                >
                  <SelectTrigger className="border-gray-200 focus:border-purple-400 focus:ring-purple-400">
                    <SelectValue placeholder="Wszystkie statusy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Wszystkie statusy</SelectItem>
                    <SelectItem value="applied">Aplikowano</SelectItem>
                    <SelectItem value="interview">Rozmowa</SelectItem>
                    <SelectItem value="offer">Oferta</SelectItem>
                    <SelectItem value="rejected">Odrzucone</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-filter" className="text-sm font-medium text-gray-700">
                  Firma
                </Label>
                <Input
                  id="company-filter"
                  placeholder="Nazwa firmy..."
                  value={localFilters.company || ""}
                  onChange={(e) => setLocalFilters({ ...localFilters, company: e.target.value || undefined })}
                  className="border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-from" className="text-sm font-medium text-gray-700">
                  Data od
                </Label>
                <Input
                  id="date-from"
                  type="date"
                  value={localFilters.dateFrom || ""}
                  onChange={(e) => setLocalFilters({ ...localFilters, dateFrom: e.target.value || undefined })}
                  className="border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-to" className="text-sm font-medium text-gray-700">
                  Data do
                </Label>
                <Input
                  id="date-to"
                  type="date"
                  value={localFilters.dateTo || ""}
                  onChange={(e) => setLocalFilters({ ...localFilters, dateTo: e.target.value || undefined })}
                  className="border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button variant="outline" onClick={handleResetFilters} className="border-gray-300 hover:bg-gray-50">
                <RotateCcw className="mr-2 h-4 w-4" />
                Resetuj
              </Button>
              <Button
                onClick={handleApplyFilters}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md"
              >
                Zastosuj filtry
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
