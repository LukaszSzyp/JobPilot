"use client"

import React from "react"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, resetError }: { error?: Error; resetError: () => void }) {
  return (
    <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200/50 max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-600 shadow-lg">
          <AlertTriangle className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-red-800">Ups! Coś poszło nie tak</CardTitle>
        <CardDescription className="text-red-600">
          Wystąpił nieoczekiwany błąd. Przepraszamy za niedogodności.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        {error && (
          <details className="text-left">
            <summary className="text-sm text-red-600 cursor-pointer hover:text-red-800 transition-colors">
              Pokaż szczegóły błędu
            </summary>
            <pre className="mt-2 text-xs bg-red-100 p-2 rounded border overflow-auto max-h-32">{error.message}</pre>
          </details>
        )}

        <div className="flex gap-2 justify-center">
          <Button
            onClick={resetError}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Spróbuj ponownie
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="border-red-200 hover:bg-red-50"
          >
            <Home className="mr-2 h-4 w-4" />
            Strona główna
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
