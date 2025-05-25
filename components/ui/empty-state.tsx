"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

export interface EmptyStateAction {
  label: string
  icon: LucideIcon
  onClick: () => void
  variant?: "default" | "outline"
  className?: string
}

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actions?: EmptyStateAction[]
  variant?: "default" | "warning" | "info"
}

const variantStyles = {
  default: {
    card: "bg-gradient-to-br from-slate-50 to-blue-50 border-blue-200/50",
    icon: "bg-gradient-to-r from-blue-500 to-indigo-500",
    title: "text-gray-900",
    description: "text-gray-600",
  },
  warning: {
    card: "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/50",
    icon: "bg-gradient-to-r from-amber-500 to-orange-500",
    title: "text-amber-900",
    description: "text-amber-700",
  },
  info: {
    card: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50",
    icon: "bg-gradient-to-r from-blue-500 to-indigo-500",
    title: "text-blue-900",
    description: "text-blue-700",
  },
}

export function EmptyState({ icon: Icon, title, description, actions = [], variant = "default" }: EmptyStateProps) {
  const styles = variantStyles[variant]

  return (
    <Card className={styles.card}>
      <CardContent className="text-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className={`w-16 h-16 ${styles.icon} rounded-full flex items-center justify-center shadow-lg`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${styles.title} mb-2`}>{title}</h3>
            <p className={`${styles.description} mb-6 max-w-md`}>{description}</p>
          </div>
          {actions.length > 0 && (
            <div className="flex gap-3">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  onClick={action.onClick}
                  variant={action.variant || "default"}
                  className={action.className}
                >
                  <action.icon className="mr-2 h-4 w-4" />
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
