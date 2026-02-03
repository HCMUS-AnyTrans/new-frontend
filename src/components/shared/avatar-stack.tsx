"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type AvatarStackSize = "sm" | "md" | "lg"

interface AvatarStackProps {
  count?: number
  showMore?: boolean
  size?: AvatarStackSize
  className?: string
}

const sizeStyles: Record<AvatarStackSize, { avatar: string; text: string; spacing: string }> = {
  sm: { avatar: "w-8 h-8 text-xs", text: "text-sm", spacing: "-space-x-2" },
  md: { avatar: "w-10 h-10 text-xs", text: "text-lg", spacing: "-space-x-3" },
  lg: { avatar: "w-12 h-12 text-sm", text: "text-xl", spacing: "-space-x-4" },
}

export function AvatarStack({
  count = 5,
  showMore = true,
  size = "md",
  className,
}: AvatarStackProps) {
  const styles = sizeStyles[size]

  return (
    <div className={cn("flex items-center", className)}>
      <div className={cn("flex", styles.spacing)}>
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className={cn(
              "rounded-full border-2 border-background",
              "bg-primary flex items-center justify-center",
              "text-primary-foreground font-semibold shadow-md",
              styles.avatar
            )}
          >
            {String.fromCharCode(65 + i)}
          </motion.div>
        ))}
      </div>
      {showMore && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + count * 0.1 }}
          className={cn(
            "ml-3 rounded-full border-2 border-dashed",
            "border-primary-500 flex items-center justify-center",
            "text-primary-500",
            styles.avatar,
            styles.text
          )}
        >
          +
        </motion.div>
      )}
    </div>
  )
}
