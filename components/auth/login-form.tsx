"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock, Navigation } from "lucide-react"
import Link from "next/link"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { signIn, isSigningIn, signInError } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    signIn({ email, password })
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo i nagłówek */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
            <Navigation className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            JobPilot
          </h1>
        </div>
        <p className="text-gray-600">Witaj ponownie! Zaloguj się do swojego konta</p>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border-white/40 shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Zaloguj się
          </CardTitle>
          <CardDescription className="text-gray-600">
            Wprowadź swoje dane, aby uzyskać dostęp do JobPilot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="twoj@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400 bg-white/80"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium flex items-center gap-2">
                <Lock className="h-4 w-4 text-blue-500" />
                Hasło
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400 bg-white/80"
              />
            </div>
            {signInError && (
              <Alert variant="destructive" className="bg-gradient-to-r from-red-50 to-red-100">
                <AlertDescription>{signInError.message || "Wystąpił błąd podczas logowania"}</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={isSigningIn}
            >
              {isSigningIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Zaloguj się
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Nie masz konta? </span>
            <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
              Zarejestruj się
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
