export interface Profile {
  id: string
  email: string
  full_name?: string
  created_at: string
  updated_at: string
}

export interface JobApplication {
  id: string
  user_id: string
  company_name: string
  position_title: string
  job_url?: string
  status: ApplicationStatus
  application_date: string
  notes?: string
  salary_range?: string
  location?: string
  created_at: string
  updated_at: string
}

export type ApplicationStatus = "applied" | "interview" | "offer" | "rejected"

export interface JobApplicationFilters {
  status?: ApplicationStatus
  company?: string
  dateFrom?: string
  dateTo?: string
}

export interface JobApplicationStats {
  total: number
  applied: number
  interview: number
  offer: number
  rejected: number
  responseRate: number
  successRate: number
}

export interface AuthUser {
  id: string
  email: string
  full_name?: string
}
