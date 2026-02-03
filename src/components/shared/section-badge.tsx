import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SectionBadgeProps {
  text: string
  icon?: LucideIcon
  variant?: "primary" | "destructive" | "secondary" | "success" | "info"
  className?: string
}

const variantStyles = {
  primary: "bg-primary/10 text-primary border-primary/20",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
  secondary: "bg-secondary/10 text-secondary-foreground border-secondary/20",
  success: "bg-success/10 text-success border-success/20",
  info: "bg-info/10 text-info border-info/20",
}

export function SectionBadge({
  text,
  icon: Icon,
  variant = "primary",
  className,
}: SectionBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border",
        variantStyles[variant],
        className
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {text}
    </span>
  )
}
