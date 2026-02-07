"use client"

import { useTranslations } from "next-intl"
import { pricingPlans } from "../data"
import { PricingCard } from "./pricing-card"
import { cn } from "@/lib/utils"

export interface PricingGridProps {
  className?: string
}

export function PricingGrid({ className }: PricingGridProps) {
  const t = useTranslations("marketing.pricingPage")
  const features = t.raw("features") as string[]

  return (
    <div className={cn("grid md:grid-cols-3 gap-8", className)}>
      {pricingPlans.map((plan) => (
        <PricingCard
          key={plan.id}
          plan={plan}
          features={features}
        />
      ))}
    </div>
  )
}
