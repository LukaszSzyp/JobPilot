"use client"

import { useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { AuthService } from "@/services/auth-service"
import { useAuthStore } from "@/store/auth-store"
import { useRouter } from "next/navigation"

export const useAuth = () => {
  const { user, setUser, setLoading } = useAuthStore()
  const queryClient = useQueryClient()
  const router = useRouter()

  // Check current session on load
  const { isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: AuthService.getCurrentUser,
    onSuccess: (data) => {
      setUser(data)
      setLoading(false)
    },
    onError: () => {
      setUser(null)
      setLoading(false)
    },
    retry: 1, // Only retry once to avoid infinite loops
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Listen for auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = AuthService.onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
      queryClient.invalidateQueries({ queryKey: ["auth"] })
    })

    return () => subscription.unsubscribe()
  }, [setUser, setLoading, queryClient])

  const signInMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => AuthService.signIn(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] })
      router.push("/dashboard")
    },
  })

  const signUpMutation = useMutation({
    mutationFn: ({ email, password, fullName }: { email: string; password: string; fullName?: string }) =>
      AuthService.signUp(email, password, fullName),
    onSuccess: () => {
      router.push("/auth/verify-email")
    },
  })

  const signOutMutation = useMutation({
    mutationFn: AuthService.signOut,
    onSuccess: () => {
      setUser(null)
      queryClient.clear()
      router.push("/")
    },
    onError: (error) => {
      console.error("Sign out error:", error)
      // Even if there's an error, clear local state
      setUser(null)
      queryClient.clear()
      router.push("/")
    },
  })

  return {
    user,
    isLoading,
    signIn: signInMutation.mutate,
    signUp: signUpMutation.mutate,
    signOut: () => signOutMutation.mutate(),
    isSigningIn: signInMutation.isPending,
    isSigningUp: signUpMutation.isPending,
    isSigningOut: signOutMutation.isPending,
    signInError: signInMutation.error,
    signUpError: signUpMutation.error,
  }
}
