"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface ActionMenuItem {
  label: string
  icon: LucideIcon
  onClick: () => void
  variant?: "default" | "destructive"
  href?: string
}

interface ActionMenuProps {
  items: ActionMenuItem[]
  triggerClassName?: string
}

export function ActionMenu({ items, triggerClassName = "" }: ActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={`h-8 w-8 p-0 hover:bg-blue-50 ${triggerClassName}`}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {items.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={item.onClick}
            className={`hover:bg-${item.variant === "destructive" ? "red" : "blue"}-50 ${
              item.variant === "destructive" ? "text-red-600" : ""
            }`}
            asChild={!!item.href}
          >
            {item.href ? (
              <a href={item.href} target="_blank" rel="noopener noreferrer">
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </a>
            ) : (
              <>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
