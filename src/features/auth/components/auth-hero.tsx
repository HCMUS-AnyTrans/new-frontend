"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

export interface AuthHeroProps {
  imageSrc: string
  imageAlt?: string
  className?: string
}

export function AuthHero({
  imageSrc,
  imageAlt = "Authentication illustration",
  className,
}: AuthHeroProps) {
  return (
    <div
      className={cn(
        "hidden lg:flex lg:flex-1",
        "items-center justify-center",
        "bg-muted/30 rounded-[30px]",
        "relative overflow-hidden",
        "min-h-[600px]",
        className
      )}
    >
      <div className="absolute inset-0 z-10">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          priority
        />
      </div>
      </div>
  )
}
