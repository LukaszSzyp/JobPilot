import { JobApplicationsService } from "@/services/job-applications-service"
import type { IJobApplicationRepository } from "@/interfaces/data-repository"
import type { JobApplication, JobApplicationFilters, JobApplicationStats } from "@/types"

export class SupabaseJobApplicationRepository implements IJobApplicationRepository {
  async getAll(filters?: JobApplicationFilters): Promise<JobApplication[]> {
    return JobApplicationsService.getApplications(filters)
  }

  async getById(id: string): Promise<JobApplication | null> {
    const applications = await this.getAll()
    return applications.find((app) => app.id === id) || null
  }

  async create(
    application: Omit<JobApplication, "id" | "user_id" | "created_at" | "updated_at">,
  ): Promise<JobApplication> {
    return JobApplicationsService.createApplication(application)
  }

  async update(id: string, updates: Partial<JobApplication>): Promise<JobApplication> {
    return JobApplicationsService.updateApplication(id, updates)
  }

  async delete(id: string): Promise<void> {
    return JobApplicationsService.deleteApplication(id)
  }

  async getStats(): Promise<JobApplicationStats> {
    return JobApplicationsService.getStats()
  }
}
