import { supabase } from "@/lib/supabase"

export interface City {
  id: number
  name: string
  voivodeship: string
}

export class CitiesService {
  static async getCities(): Promise<City[]> {
    const { data, error } = await supabase.from("cities").select("*").order("name")

    if (error) throw error
    return data || []
  }

  static async getCitiesByVoivodeship(): Promise<Record<string, City[]>> {
    const cities = await this.getCities()
    return cities.reduce(
      (acc, city) => {
        if (!acc[city.voivodeship]) {
          acc[city.voivodeship] = []
        }
        acc[city.voivodeship].push(city)
        return acc
      },
      {} as Record<string, City[]>,
    )
  }
}

// Dane demo dla trybu offline
export const DEMO_CITIES: City[] = [
  { id: 1, name: "Warszawa", voivodeship: "mazowieckie" },
  { id: 2, name: "Kraków", voivodeship: "małopolskie" },
  { id: 3, name: "Wrocław", voivodeship: "dolnośląskie" },
  { id: 4, name: "Gdańsk", voivodeship: "pomorskie" },
  { id: 5, name: "Poznań", voivodeship: "wielkopolskie" },
  { id: 6, name: "Łódź", voivodeship: "łódzkie" },
  { id: 7, name: "Szczecin", voivodeship: "zachodniopomorskie" },
  { id: 8, name: "Katowice", voivodeship: "śląskie" },
  { id: 9, name: "Lublin", voivodeship: "lubelskie" },
  { id: 10, name: "Bydgoszcz", voivodeship: "kujawsko-pomorskie" },
  { id: 11, name: "Białystok", voivodeship: "podlaskie" },
  { id: 12, name: "Rzeszów", voivodeship: "podkarpackie" },
  { id: 13, name: "Praca zdalna", voivodeship: "cała Polska" },
]
