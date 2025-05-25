"use client"

import type React from "react"

interface FormGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  gap?: 2 | 4 | 6 | 8
}

export function FormGrid({ children, columns = 2, gap = 4 }: FormGridProps) {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }

  const gapClasses = {
    2: "gap-2",
    4: "gap-4",
    6: "gap-6",
    8: "gap-8",
  }

  return <div className={`grid ${gridClasses[columns]} ${gapClasses[gap]}`}>{children}</div>
}
