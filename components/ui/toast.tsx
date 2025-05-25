"use client"
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ToastProps {
  title?: string
  description?: string
  variant?: "default" | "success" | "error" | "warning" | "info"
  onClose?: () => void
}

const variantConfig = {
  default: {
    className: "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200",
    icon: Info,
    iconColor: "text-gray-600",
  },
  success: {
    className: "bg-gradient-to-r from-emerald-50 to-green-100 border-emerald-200",
    icon: CheckCircle,
    iconColor: "text-emerald-600",
  },
  error: {
    className: "bg-gradient-to-r from-red-50 to-red-100 border-red-200",
    icon: XCircle,
    iconColor: "text-red-600",
  },
  warning: {
    className: "bg-gradient-to-r from-amber-50 to-orange-100 border-amber-200",
    icon: AlertTriangle,
    iconColor: "text-amber-600",
  },
  info: {
    className: "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200",
    icon: Info,
    iconColor: "text-blue-600",
  },
}

export function Toast({ title, description, variant = "default", onClose }: ToastProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <div
      className={cn(
        "relative flex w-full items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl",
        config.className,
      )}
    >
      <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", config.iconColor)} />
      <div className="flex-1 space-y-1">
        {title && <p className="text-sm font-semibold text-gray-900">{title}</p>}
        {description && <p className="text-sm text-gray-700">{description}</p>}
      </div>
      {onClose && (
        <button onClick={onClose} className="flex-shrink-0 rounded-md p-1 hover:bg-white/50 transition-colors">
          <X className="h-4 w-4 text-gray-500" />
        </button>
      )}
    </div>
  )
}
