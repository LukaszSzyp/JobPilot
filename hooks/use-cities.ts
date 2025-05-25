"use client"

import { useQuery } from "@tanstack/react-query"
import { CitiesService, DEMO_CITIES } from "@/services/cities-service"
import { useAuthStore } from "@/store/auth-store"

export const useCities = () => {
  const { user } = useAuthStore()

  const { data: cities = [], isLoading } = useQuery({
    queryKey: ["cities"],
    queryFn: () => {
      if (user) {
        return CitiesService.getCities()
      } else {
        // Tryb demo - użyj lokalnych danych
        return Promise.resolve(DEMO_CITIES)
      }
    },
    staleTime: 1000 * 60 * 60, // 1 godzina - miasta się rzadko zmieniają
  })

  return {
    cities,
    isLoading,
  }
}
