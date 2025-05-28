"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { AuthService } from "@/services/auth-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get parameters from URL (both from hash and query params)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get("access_token") || searchParams.get("access_token")
        const refreshToken = hashParams.get("refresh_token") || searchParams.get("refresh_token")
        const type = hashParams.get("type") || searchParams.get("type")

        if (accessToken && refreshToken) {
          // Set session in Supabase
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (error) {
            throw error
          }

          if (data.user) {
            console.log("🔧 Ensuring profile exists for user:", data.user.id)

            // Use AuthService to ensure profile exists
            await AuthService.ensureProfileExists(data.user)

            setStatus("success")
            setMessage(
              type === "signup"
                ? "Email został pomyślnie zweryfikowany! Twoje konto jest teraz aktywne."
                : "Logowanie zakończone sukcesem!",
            )

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
              router.push("/dashboard")
            }, 2000)
          }
        } else {
          throw new Error("Brak wymaganych parametrów autoryzacji")
        }
      } catch (error) {
        console.error("Error during authorization:", error)
        setStatus("error")
        setMessage(error instanceof Error ? error.message : "Wystąpił nieoczekiwany błąd")
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5"></div>
      <div className="relative w-full max-w-md mx-auto">
        {/* Logo and header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
              <Navigation className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              JobPilot
            </h1>
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-white/40 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {status === "loading" && "Weryfikacja konta..."}
              {status === "success" && "Sukces!"}
              {status === "error" && "Błąd weryfikacji"}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {status === "loading" && "Przetwarzamy Twoje dane autoryzacyjne"}
              {status === "success" && "Za chwilę zostaniesz przekierowany do aplikacji"}
              {status === "error" && "Wystąpił problem podczas weryfikacji konta"}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {status === "loading" && (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Proszę czekać...</p>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center space-y-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <p className="text-sm text-green-600">{message}</p>
                <p className="text-xs text-muted-foreground">Przekierowanie nastąpi automatycznie...</p>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center space-y-4">
                <XCircle className="h-8 w-8 text-red-600" />
                <p className="text-sm text-red-600">{message}</p>
                <Button onClick={() => router.push("/auth/login")} className="mt-4">
                  Przejdź do logowania
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-600 font-medium">Ładowanie...</p>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  )
}
