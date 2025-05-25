import type { JobApplication, JobApplicationFilters, JobApplicationStats } from "@/types"

const DEMO_STORAGE_KEY = "jobpilot_demo_applications"
const MAX_DEMO_APPLICATIONS = 10

// Sample data for demo mode
const SAMPLE_APPLICATIONS: Omit<JobApplication, "id" | "user_id" | "created_at" | "updated_at">[] = [
  {
    company_name: "Google",
    position_title: "Senior Frontend Developer",
    job_url: "https://careers.google.com/jobs/frontend-dev",
    status: "interview",
    application_date: "2024-01-15",
    notes: "Bardzo ciekawa pozycja w zespole YouTube. Rozmowa techniczna zaplanowana na przyszły tydzień.",
    salary_range: "15000-20000 PLN",
    location: "Warszawa",
  },
  {
    company_name: "Microsoft",
    position_title: "React Developer",
    job_url: "https://careers.microsoft.com/react-dev",
    status: "applied",
    application_date: "2024-01-10",
    notes: "Aplikacja przez LinkedIn. Czekam na odpowiedź od HR.",
    salary_range: "12000-16000 PLN",
    location: "Kraków",
  },
  {
    company_name: "Allegro",
    position_title: "Full Stack Developer",
    job_url: "https://allegro.pl/jobs/fullstack",
    status: "offer",
    application_date: "2024-01-05",
    notes: "Otrzymałem ofertę! Bardzo dobra atmosfera w zespole. Negocjuję warunki.",
    salary_range: "14000-18000 PLN",
    location: "Poznań",
  },
  {
    company_name: "CD Projekt",
    position_title: "Game Developer",
    job_url: "https://cdprojekt.com/careers",
    status: "rejected",
    application_date: "2024-01-01",
    notes: "Niestety odrzucili moją aplikację. Brak doświadczenia w Unity.",
    salary_range: "10000-14000 PLN",
    location: "Warszawa",
  },
  {
    company_name: "Asseco",
    position_title: "JavaScript Developer",
    job_url: "https://asseco.pl/careers/js-dev",
    status: "applied",
    application_date: "2024-01-20",
    notes: "Lokalna firma z dobrą opinią. Aplikacja przez ich stronę internetową.",
    salary_range: "8000-12000 PLN",
    location: "Rzeszów",
  },
]

function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

function createFullApplication(
  data: Omit<JobApplication, "id" | "user_id" | "created_at" | "updated_at">,
): JobApplication {
  const now = new Date().toISOString()
  return {
    ...data,
    id: generateId(),
    user_id: "demo-user",
    created_at: now,
    updated_at: now,
  }
}

export class DemoDataService {
  static initializeSampleData(): void {
    if (typeof window === "undefined") return

    const existing = localStorage.getItem(DEMO_STORAGE_KEY)
    if (!existing) {
      const sampleApps = SAMPLE_APPLICATIONS.map(createFullApplication)
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(sampleApps))
    }
  }

  static ensureDataExists(): JobApplication[] {
    if (typeof window === "undefined") return []

    // Check if data exists, if not - initialize
    let stored = localStorage.getItem(DEMO_STORAGE_KEY)
    if (!stored) {
      this.initializeSampleData()
      stored = localStorage.getItem(DEMO_STORAGE_KEY)
    }

    return stored ? JSON.parse(stored) : []
  }

  static getApplications(filters?: JobApplicationFilters): JobApplication[] {
    let applications = this.ensureDataExists()

    // Apply filters
    if (filters?.status && filters.status !== "all") {
      applications = applications.filter((app) => app.status === filters.status)
    }

    if (filters?.company) {
      applications = applications.filter((app) =>
        app.company_name.toLowerCase().includes(filters.company!.toLowerCase()),
      )
    }

    if (filters?.dateFrom) {
      applications = applications.filter((app) => app.application_date >= filters.dateFrom!)
    }

    if (filters?.dateTo) {
      applications = applications.filter((app) => app.application_date <= filters.dateTo!)
    }

    // Sort by date (newest first)
    return applications.sort((a, b) => new Date(b.application_date).getTime() - new Date(a.application_date).getTime())
  }

  static createApplication(
    application: Omit<JobApplication, "id" | "user_id" | "created_at" | "updated_at">,
  ): JobApplication {
    if (typeof window === "undefined") throw new Error("Cannot create application on server")

    const applications = this.ensureDataExists()

    if (applications.length >= MAX_DEMO_APPLICATIONS) {
      throw new Error(`Maksymalna liczba aplikacji w trybie demo to ${MAX_DEMO_APPLICATIONS}`)
    }

    const newApplication = createFullApplication(application)
    const updatedApplications = [newApplication, ...applications]

    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(updatedApplications))
    return newApplication
  }

  static updateApplication(id: string, updates: Partial<JobApplication>): JobApplication {
    if (typeof window === "undefined") throw new Error("Cannot update application on server")

    const applications = this.ensureDataExists()
    const index = applications.findIndex((app) => app.id === id)

    if (index === -1) {
      throw new Error("Aplikacja nie została znaleziona")
    }

    const updatedApplication = {
      ...applications[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }

    applications[index] = updatedApplication
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(applications))

    return updatedApplication
  }

  static deleteApplication(id: string): void {
    if (typeof window === "undefined") throw new Error("Cannot delete application on server")

    const applications = this.ensureDataExists()
    const filteredApplications = applications.filter((app) => app.id !== id)

    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(filteredApplications))
  }

  static getStats(): JobApplicationStats {
    const applications = this.ensureDataExists()
    const total = applications.length
    const applied = applications.filter((app) => app.status === "applied").length
    const interview = applications.filter((app) => app.status === "interview").length
    const offer = applications.filter((app) => app.status === "offer").length
    const rejected = applications.filter((app) => app.status === "rejected").length

    const responseRate = total > 0 ? ((interview + offer + rejected) / total) * 100 : 0
    const successRate = total > 0 ? (offer / total) * 100 : 0

    return {
      total,
      applied,
      interview,
      offer,
      rejected,
      responseRate: Math.round(responseRate * 100) / 100,
      successRate: Math.round(successRate * 100) / 100,
    }
  }

  static getRemainingSlots(): number {
    const applications = this.ensureDataExists()
    return Math.max(0, MAX_DEMO_APPLICATIONS - applications.length)
  }

  static clearAllData(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(DEMO_STORAGE_KEY)
  }
}
