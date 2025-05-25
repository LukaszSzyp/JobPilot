"use client"

import { useCities } from "@/hooks/use-cities"
import { CitySelectServer } from "./city-select-server"
import { LoadingSpinner } from "./loading-spinner"

interface CitySelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
}

export function CitySelect({ value, onValueChange, placeholder }: CitySelectProps) {
  const { cities, isLoading } = useCities()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-10 border border-gray-200 rounded-md bg-white/80">
        <LoadingSpinner size="sm" />
      </div>
    )
  }

  return <CitySelectServer cities={cities} value={value} onValueChange={onValueChange} placeholder={placeholder} />
}
