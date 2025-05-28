import { supabase } from "@/lib/supabase"
import type { JobApplication, JobApplicationFilters, JobApplicationStats } from "@/types"

export class JobApplicationsService {
  static async getApplications(filters?: JobApplicationFilters): Promise<JobApplication[]> {
    // Get current user ID
    const {
      data: { user },
    } = await supabase.auth.getUser()

    console.log("🔍 Getting applications for user:", user?.id)

    // Start query with user_id filter to respect RLS
    let query = supabase.from("job_applications").select("*").order("application_date", { ascending: false })

    // Add user_id filter if user is logged in
    if (user) {
      query = query.eq("user_id", user.id)
    }

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

    if (error) {
      console.error("❌ Error getting applications:", error)
      throw error
    }

    console.log("✅ Got applications:", data?.length || 0)
    return data || []
  }

  static async createApplication(
    application: Omit<JobApplication, "id" | "user_id" | "created_at" | "updated_at">,
  ): Promise<JobApplication> {
    console.log("🚀 Creating application:", application)

    // Get current user ID
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    console.log("👤 Current user:", user?.id)
    console.log("🔐 User error:", userError)

    if (userError) {
      console.error("❌ Error getting user:", userError)
      throw userError
    }

    if (!user) {
      console.error("❌ No user found")
      throw new Error("User must be logged in to create an application")
    }

    // Add user_id to the application data
    const applicationWithUserId = {
      ...application,
      user_id: user.id,
    }

    console.log("📝 Application with user_id:", applicationWithUserId)

    const { data, error } = await supabase.from("job_applications").insert([applicationWithUserId]).select().single()

    if (error) {
      console.error("❌ Error creating application:", error)
      console.error("❌ Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      })
      throw error
    }

    console.log("✅ Application created successfully:", data)
    return data
  }

  static async updateApplication(id: string, updates: Partial<JobApplication>): Promise<JobApplication> {
    console.log("🔄 Updating application:", id, updates)

    const { data, error } = await supabase
      .from("job_applications")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("❌ Error updating application:", error)
      throw error
    }

    console.log("✅ Application updated successfully:", data)
    return data
  }

  static async deleteApplication(id: string): Promise<void> {
    console.log("🗑️ Deleting application:", id)

    const { error } = await supabase.from("job_applications").delete().eq("id", id)

    if (error) {
      console.error("❌ Error deleting application:", error)
      throw error
    }

    console.log("✅ Application deleted successfully")
  }

  static async getStats(): Promise<JobApplicationStats> {
    // Get current user ID
    const {
      data: { user },
    } = await supabase.auth.getUser()

    let query = supabase.from("job_applications").select("status")

    // Add user_id filter if user is logged in
    if (user) {
      query = query.eq("user_id", user.id)
    }

    const { data, error } = await query

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
