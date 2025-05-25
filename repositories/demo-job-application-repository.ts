import { DemoDataService } from "@/services/demo-data-service"
import type { IJobApplicationRepository } from "@/interfaces/data-repository"
import type { JobApplication, JobApplicationFilters, JobApplicationStats } from "@/types"

export class DemoJobApplicationRepository implements IJobApplicationRepository {
  async getAll(filters?: JobApplicationFilters): Promise<JobApplication[]> {
    return Promise.resolve(DemoDataService.getApplications(filters))
  }

  async getById(id: string): Promise<JobApplication | null> {
    const applications = await this.getAll()
    return applications.find((app) => app.id === id) || null
  }

  async create(
    application: Omit<JobApplication, "id" | "user_id" | "created_at" | "updated_at">,
  ): Promise<JobApplication> {
    return Promise.resolve(DemoDataService.createApplication(application))
  }

  async update(id: string, updates: Partial<JobApplication>): Promise<JobApplication> {
    return Promise.resolve(DemoDataService.updateApplication(id, updates))
  }

  async delete(id: string): Promise<void> {
    DemoDataService.deleteApplication(id)
    return Promise.resolve()
  }

  async getStats(): Promise<JobApplicationStats> {
    return Promise.resolve(DemoDataService.getStats())
  }
}
