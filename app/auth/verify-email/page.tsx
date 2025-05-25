import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, ArrowLeft, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5"></div>
      <div className="relative w-full max-w-md mx-auto">
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
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-white/40 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 mb-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Sprawdź swoją skrzynkę email
            </CardTitle>
            <CardDescription className="text-gray-600">
              Wysłaliśmy link weryfikacyjny na Twój adres email. Kliknij w link, aby aktywować swoje konto.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                <strong>Nie otrzymałeś emaila?</strong>
                <br />
                Sprawdź folder spam lub skontaktuj się z nami.
              </p>
            </div>

            <Button variant="outline" asChild className="w-full border-blue-200 hover:bg-blue-50">
              <Link href="/auth/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Powrót do logowania
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
