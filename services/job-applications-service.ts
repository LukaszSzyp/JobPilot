import { supabase } from "@/lib/supabase"
import type { JobApplication, JobApplicationFilters, JobApplicationStats } from "@/types"

export class JobApplicationsService {
  static async getApplications(filters?: JobApplicationFilters): Promise<JobApplication[]> {
    let query = supabase.from("job_applications").select("*").order("application_date", { ascending: false })

    if (filters?.status) {
      query = query.eq("status", filters.status)
    }

    if (filters?.company) {
      query = query.ilike("company_name", `%${filters.company}%`)
    }

    if (filters?.dateFrom) {
      query = query.gte("application_date", filters.dateFrom)
    }

    if (filters?.dateTo) {
      query = query.lte("application_date", filters.dateTo)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  }

  static async createApplication(
    application: Omit<JobApplication, "id" | "user_id" | "created_at" | "updated_at">,
  ): Promise<JobApplication> {
    const { data, error } = await supabase.from("job_applications").insert([application]).select().single()

    if (error) throw error
    return data
  }

  static async updateApplication(id: string, updates: Partial<JobApplication>): Promise<JobApplication> {
    const { data, error } = await supabase
      .from("job_applications")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deleteApplication(id: string): Promise<void> {
    const { error } = await supabase.from("job_applications").delete().eq("id", id)

    if (error) throw error
  }

  static async getStats(): Promise<JobApplicationStats> {
    const { data, error } = await supabase.from("job_applications").select("status")

    if (error) throw error

    const applications = data || []
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
}
