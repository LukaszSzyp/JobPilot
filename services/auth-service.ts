import { supabase } from "@/lib/supabase"
import type { AuthUser } from "@/types"

export class AuthService {
  static async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) throw error
    return data
  }

  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    // Ensure profile exists after successful sign in
    if (data.user) {
      await this.ensureProfileExists(data.user)
    }

    return data
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  static async ensureProfileExists(user: any) {
    try {
      // Check if profile exists
      const { data: existingProfile, error: selectError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single()

      // If profile doesn't exist, create it
      if (selectError && selectError.code === "PGRST116") {
        console.log("🔧 Creating missing profile for user:", user.id)

        const { error: insertError } = await supabase.from("profiles").insert([
          {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || "",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])

        if (insertError) {
          console.error("❌ Error creating profile:", insertError)
          throw insertError
        }

        console.log("✅ Profile created successfully")
      } else if (selectError) {
        console.error("❌ Error checking profile:", selectError)
        throw selectError
      } else {
        console.log("✅ Profile already exists")
      }
    } catch (error) {
      console.error("❌ Error in ensureProfileExists:", error)
      throw error
    }
  }

  static async getCurrentUser(): Promise<AuthUser | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    // Ensure profile exists
    await this.ensureProfileExists(user)

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    return {
      id: user.id,
      email: user.email!,
      full_name: profile?.full_name,
    }
  }

  static onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Ensure profile exists when auth state changes
        await this.ensureProfileExists(session.user)
        const user = await this.getCurrentUser()
        callback(user)
      } else {
        callback(null)
      }
    })
  }
}
