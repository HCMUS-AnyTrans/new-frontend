"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type TrustBadgeVariant = "success" | "info" | "warning" | "primary"

interface TrustBadgeProps {
  text: string
  pulse?: boolean
  variant?: TrustBadgeVariant
  className?: string
}

const variantStyles: Record<TrustBadgeVariant, string> = {
  success: "bg-success",
  info: "bg-info",
  warning: "bg-warning",
  primary: "bg-primary",
}

export function TrustBadge({
  text,
  pulse = true,
  variant = "success",
  className,
}: TrustBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full",
        "bg-background border border-border shadow-sm",
        className
      )}
    >
      <motion.span
        animate={pulse ? { scale: [1, 1.2, 1] } : undefined}
        transition={{ duration: 2, repeat: Infinity }}
        className={cn("w-2 h-2 rounded-full", variantStyles[variant])}
      />
      <span className="text-sm font-medium text-primary">{text}</span>
    </motion.div>
  )
}
