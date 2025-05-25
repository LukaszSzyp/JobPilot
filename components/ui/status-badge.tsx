import { Badge } from "@/components/ui/badge"
import type { ApplicationStatus } from "@/types"

const statusConfig = {
  applied: {
    label: "Aplikowano",
    className: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300",
    dot: "bg-blue-500",
  },
  interview: {
    label: "Rozmowa",
    className: "bg-gradient-to-r from-amber-100 to-orange-200 text-amber-800 border-amber-300",
    dot: "bg-amber-500",
  },
  offer: {
    label: "Oferta",
    className: "bg-gradient-to-r from-emerald-100 to-green-200 text-emerald-800 border-emerald-300",
    dot: "bg-emerald-500",
  },
  rejected: {
    label: "Odrzucone",
    className: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300",
    dot: "bg-red-500",
  },
} as const

interface StatusBadgeProps {
  status: ApplicationStatus
  showDot?: boolean
  size?: "sm" | "md" | "lg"
}

export function StatusBadge({ status, showDot = false, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status]

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  }

  return (
    <div className="flex items-center gap-2">
      {showDot && <div className={`w-2 h-2 rounded-full ${config.dot}`} />}
      <Badge className={`${config.className} font-medium shadow-sm ${sizeClasses[size]}`}>{config.label}</Badge>
    </div>
  )
}

export { statusConfig }
