"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FormContainerProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function FormContainer({ title, description, children, className = "" }: FormContainerProps) {
  return (
    <Card className={`bg-gradient-to-br from-white to-blue-50/30 border-white/40 ${className}`}>
      <CardHeader>
        <CardTitle className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
