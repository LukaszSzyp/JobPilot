"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { ReactNode } from "react"

interface FormFieldProps {
  label: string
  icon?: ReactNode
  required?: boolean
  children: ReactNode
  className?: string
}

export function FormField({ label, icon, required, children, className = "" }: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-gray-700 font-medium flex items-center gap-2">
        {icon}
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
    </div>
  )
}

interface FormInputProps {
  id: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  minLength?: number
}

export function FormInput({ id, type = "text", value, onChange, placeholder, required, minLength }: FormInputProps) {
  return (
    <Input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      minLength={minLength}
      className="border-gray-200 focus:border-blue-400 focus:ring-blue-400 bg-white/80"
    />
  )
}

interface FormTextareaProps {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}

export function FormTextarea({ id, value, onChange, placeholder, rows = 3 }: FormTextareaProps) {
  return (
    <Textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="border-gray-200 focus:border-blue-400 focus:ring-blue-400 bg-white/80"
    />
  )
}
