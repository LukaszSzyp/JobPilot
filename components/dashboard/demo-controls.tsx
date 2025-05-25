"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, RefreshCw, AlertTriangle } from "lucide-react"
import { DemoDataService } from "@/services/demo-data-service"
import { useJobApplications } from "@/hooks/use-job-applications"
import { useQueryClient } from "@tanstack/react-query"

export function DemoControls() {
  const [isClearing, setIsClearing] = useState(false)
  const { isDemo } = useJobApplications()
  const queryClient = useQueryClient()

  if (!isDemo) return null

  const handleClearData = async () => {
    if (!confirm("Czy na pewno chcesz usunąć wszystkie dane demo? Ta akcja jest nieodwracalna.")) {
      return
    }

    setIsClearing(true)
    try {
      DemoDataService.clearAllData()
      DemoDataService.initializeSampleData()
      await queryClient.invalidateQueries({ queryKey: ["job-applications"] })
      await queryClient.invalidateQueries({ queryKey: ["job-applications-stats"] })
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200/50">
      <CardHeader>
        <CardTitle className="text-red-800 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Zarządzanie danymi demo
        </CardTitle>
        <CardDescription className="text-red-600">Opcje zarządzania danymi w trybie demonstracyjnym</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Dane w trybie demo są przechowywane lokalnie w przeglądarce i zostaną utracone po wyczyszczeniu danych
            przeglądarki.
          </AlertDescription>
        </Alert>

        <div className="flex gap-2">
          <Button
            onClick={handleClearData}
            disabled={isClearing}
            variant="destructive"
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
          >
            {isClearing ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
            Resetuj dane demo
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
