"use client"

import { pricingPlans, pricingFeatures } from "@/data/pricing"
import { PricingCard } from "./pricing-card"
import { cn } from "@/lib/utils"

export interface PricingGridProps {
  className?: string
}

export function PricingGrid({ className }: PricingGridProps) {
  return (
    <div className={cn("grid md:grid-cols-3 gap-8", className)}>
      {pricingPlans.map((plan, index) => (
        <PricingCard
          key={plan.id}
          plan={plan}
          features={pricingFeatures}
          index={index}
        />
      ))}
    </div>
  )
}
