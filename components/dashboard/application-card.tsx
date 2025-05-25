"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { ApplicationInfo } from "@/components/ui/application-info"
import { ActionMenu, type ActionMenuItem } from "@/components/ui/action-menu"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import type { JobApplication } from "@/types"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { Edit, ExternalLink, Trash2 } from "lucide-react"

interface ApplicationCardProps {
  application: JobApplication
  onEdit: (application: JobApplication) => void
  onDelete: (id: string) => void
}

export function ApplicationCard({ application, onEdit, onDelete }: ApplicationCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = () => {
    onDelete(application.id)
  }

  const actions: ActionMenuItem[] = [
    {
      label: "Edytuj",
      icon: Edit,
      onClick: () => onEdit(application),
    },
    ...(application.job_url
      ? [
          {
            label: "Otwórz ogłoszenie",
            icon: ExternalLink,
            onClick: () => window.open(application.job_url, "_blank"),
          },
        ]
      : []),
    {
      label: "Usuń",
      icon: Trash2,
      onClick: () => setShowDeleteDialog(true),
      variant: "destructive" as const,
    },
  ]

  return (
    <>
      <Card className="bg-white/80 backdrop-blur-sm border-white/40 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {application.position_title}
                </CardTitle>
              </div>
              <p className="text-sm text-gray-600 font-medium">{application.company_name}</p>
              {application.location && <p className="text-sm text-gray-500">{application.location}</p>}
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={application.status} showDot />
              <ActionMenu items={actions} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <ApplicationInfo
                label="Data aplikacji"
                value={format(new Date(application.application_date), "dd MMMM yyyy", { locale: pl })}
              />
              {application.salary_range && <ApplicationInfo label="Widełki" value={application.salary_range} />}
            </div>
            {application.notes && (
              <div className="mt-4 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200/50">
                <ApplicationInfo label="Notatki" value={application.notes} className="items-start" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Usuń aplikację"
        description={`Czy na pewno chcesz usunąć aplikację na stanowisko "${application.position_title}" w firmie "${application.company_name}"? Ta akcja nie może zostać cofnięta.`}
        confirmText="Usuń aplikację"
        cancelText="Anuluj"
        variant="destructive"
      />
    </>
  )
}
