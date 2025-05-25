"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { City } from "@/services/cities-service"

interface CitySelectServerProps {
  cities: City[]
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
}

export function CitySelectServer({
  cities,
  value,
  onValueChange,
  placeholder = "Wybierz miasto...",
}: CitySelectServerProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="border-gray-200 focus:border-blue-400 focus:ring-blue-400 bg-white/80">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-60">
        {cities.map((city) => (
          <SelectItem key={city.id} value={city.name}>
            <div className="flex items-center justify-between w-full">
              <span>{city.name}</span>
              <span className="text-xs text-gray-500 ml-2">{city.voivodeship}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
