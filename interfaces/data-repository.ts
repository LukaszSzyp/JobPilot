import type { JobApplication, JobApplicationFilters, JobApplicationStats } from "@/types"

export interface IJobApplicationRepository {
  getAll(filters?: JobApplicationFilters): Promise<JobApplication[]>
  getById(id: string): Promise<JobApplication | null>
  create(application: Omit<JobApplication, "id" | "user_id" | "created_at" | "updated_at">): Promise<JobApplication>
  update(id: string, updates: Partial<JobApplication>): Promise<JobApplication>
  delete(id: string): Promise<void>
  getStats(): Promise<JobApplicationStats>
}

export interface ICityRepository {
  getAll(): Promise<Array<{ id: number; name: string; voivodeship: string }>>
}
