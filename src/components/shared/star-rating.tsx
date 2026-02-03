"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  maxStars?: number
  showText?: boolean
  className?: string
}

export function StarRating({
  rating,
  maxStars = 5,
  showText = true,
  className,
}: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: maxStars }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "w-4 h-4",
            i < Math.floor(rating)
              ? "fill-secondary text-secondary"
              : "fill-muted text-muted"
          )}
        />
      ))}
      {showText && (
        <span className="ml-1 text-muted-foreground font-medium">
          {rating.toFixed(1)}/5
        </span>
      )}
    </div>
  )
}
