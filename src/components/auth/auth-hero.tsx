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
      {/* Background Pattern/Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

      {/* Main Illustration */}
      <div className="relative z-10 w-full max-w-md px-8">
        <div className="relative aspect-[4/5] w-full">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Carousel Indicator Dots */}
        <div className="flex justify-center gap-2 mt-8">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
          <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-20 h-20 bg-primary/10 rounded-full blur-2xl" />
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
    </div>
  )
}
