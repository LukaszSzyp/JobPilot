"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useJobApplications } from "@/hooks/use-job-applications"
import type { JobApplication, ApplicationStatus } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertTriangle, Info, MapPin } from "lucide-react"
import { CitySelect } from "@/components/ui/city-select"

interface ApplicationDialogProps {
  application?: JobApplication | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ApplicationDialog({ application, open, onOpenChange }: ApplicationDialogProps) {
  const {
    create: createApplication,
    update: updateApplication,
    isCreating,
    isUpdating,
    remainingSlots,
    isDemo,
    canAddMore,
    error,
  } = useJobApplications()

  const [formData, setFormData] = useState({
    company_name: "",
    position_title: "",
    job_url: "",
    status: "applied" as ApplicationStatus,
    application_date: new Date().toISOString().split("T")[0],
    notes: "",
    salary_range: "",
    location: "",
  })

  useEffect(() => {
    if (application) {
      setFormData({
        company_name: application.company_name,
        position_title: application.position_title,
        job_url: application.job_url || "",
        status: application.status,
        application_date: application.application_date,
        notes: application.notes || "",
        salary_range: application.salary_range || "",
        location: application.location || "",
      })
    } else {
      setFormData({
        company_name: "",
        position_title: "",
        job_url: "",
        status: "applied",
        application_date: new Date().toISOString().split("T")[0],
        notes: "",
        salary_range: "",
        location: "",
      })
    }
  }, [application, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log("📝 Form submitted:", formData)
    console.log("🎯 Is demo:", isDemo)
    console.log("🎯 Can add more:", canAddMore)

    if (application) {
      console.log("🔄 Updating application:", application.id)
      updateApplication({ id: application.id, input: formData })
    } else {
      console.log("🚀 Creating new application")
      createApplication(formData)
    }

    onOpenChange(false)
  }

  const isLoading = isCreating || isUpdating

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] bg-gradient-to-br from-white to-blue-50/30 border-white/40">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {application ? "Edytuj aplikację" : "Dodaj nową aplikację"}
          </DialogTitle>
          <DialogDescription>
            {application
              ? "Zaktualizuj informacje o swojej aplikacji o pracę."
              : "Dodaj nową aplikację o pracę do swojego trackera."}
          </DialogDescription>
        </DialogHeader>

        {/* Informacja o trybie demo */}
        {isDemo && !application && (
          <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Tryb demonstracyjny:</strong> Możesz dodać maksymalnie 10 aplikacji.{" "}
              <span className="font-semibold text-blue-700">Pozostało: {remainingSlots} slotów</span>
            </AlertDescription>
          </Alert>
        )}

        {/* Błąd przy przekroczeniu limitu lub inne błędy */}
        {error && (
          <Alert variant="destructive" className="bg-gradient-to-r from-red-50 to-red-100">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Błąd:</strong> {error.message}
              <details className="mt-2 text-xs">
                <summary>Szczegóły błędu (kliknij aby rozwinąć)</summary>
                <pre className="mt-1 whitespace-pre-wrap">{JSON.stringify(error, null, 2)}</pre>
              </details>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_name" className="text-gray-700 font-medium">
                  Firma *
                </Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  required
                  className="border-gray-200 focus:border-blue-400 focus:ring-blue-400 bg-white/80"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position_title" className="text-gray-700 font-medium">
                  Stanowisko *
                </Label>
                <Input
                  id="position_title"
                  value={formData.position_title}
                  onChange={(e) => setFormData({ ...formData, position_title: e.target.value })}
                  required
                  className="border-gray-200 focus:border-blue-400 focus:ring-blue-400 bg-white/80"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="job_url" className="text-gray-700 font-medium">
                Link do ogłoszenia
              </Label>
              <Input
                id="job_url"
                type="url"
                value={formData.job_url}
                onChange={(e) => setFormData({ ...formData, job_url: e.target.value })}
                placeholder="https://..."
                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400 bg-white/80"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status" className="text-gray-700 font-medium">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: ApplicationStatus) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="border-gray-200 focus:border-blue-400 focus:ring-blue-400 bg-white/80">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="applied">Aplikowano</SelectItem>
                    <SelectItem value="interview">Rozmowa</SelectItem>
                    <SelectItem value="offer">Oferta</SelectItem>
                    <SelectItem value="rejected">Odrzucone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="application_date" className="text-gray-700 font-medium">
                  Data aplikacji
                </Label>
                <Input
                  id="application_date"
                  type="date"
                  value={formData.application_date}
                  onChange={(e) => setFormData({ ...formData, application_date: e.target.value })}
                  required
                  className="border-gray-200 focus:border-blue-400 focus:ring-blue-400 bg-white/80"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-700 font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  Lokalizacja
                </Label>
                <CitySelect
                  value={formData.location}
                  onValueChange={(value) => setFormData({ ...formData, location: value })}
                  placeholder="Wybierz miasto..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary_range" className="text-gray-700 font-medium">
                  Widełki płacowe
                </Label>
                <Input
                  id="salary_range"
                  value={formData.salary_range}
                  onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                  placeholder="8000-12000 PLN"
                  className="border-gray-200 focus:border-blue-400 focus:ring-blue-400 bg-white/80"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-gray-700 font-medium">
                Notatki
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Dodatkowe informacje o aplikacji..."
                rows={3}
                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400 bg-white/80"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Anuluj
            </Button>
            <Button
              type="submit"
              disabled={isLoading || (!application && !canAddMore)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {application ? "Zaktualizuj" : "Dodaj aplikację"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
