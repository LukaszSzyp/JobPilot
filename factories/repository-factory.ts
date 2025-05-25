import type { IJobApplicationRepository, ICityRepository } from "@/interfaces/data-repository"
import { SupabaseJobApplicationRepository } from "@/repositories/supabase-job-application-repository"
import { DemoJobApplicationRepository } from "@/repositories/demo-job-application-repository"
import { CitiesService, DEMO_CITIES } from "@/services/cities-service"

export class RepositoryFactory {
  static createJobApplicationRepository(isDemo: boolean): IJobApplicationRepository {
    return isDemo ? new DemoJobApplicationRepository() : new SupabaseJobApplicationRepository()
  }

  static createCityRepository(isDemo: boolean): ICityRepository {
    return {
      getAll: () => (isDemo ? Promise.resolve(DEMO_CITIES) : CitiesService.getCities()),
    }
  }
}
