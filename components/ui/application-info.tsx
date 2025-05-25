import type React from "react"
interface ApplicationInfoProps {
  label: string
  value: string | React.ReactNode
  className?: string
}

export function ApplicationInfo({ label, value, className = "" }: ApplicationInfoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-gray-500 text-sm min-w-fit">{label}:</span>
      <span className="font-medium text-gray-700 text-sm">{value}</span>
    </div>
  )
}
