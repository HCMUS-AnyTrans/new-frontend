"use client"

import { useTranslations } from "next-intl"
import { PricingCard } from "./pricing-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useCreditPackages } from "@/features/settings"
import { cn } from "@/lib/utils"
import type { Plan } from "../data"

export interface PricingGridProps {
  className?: string
}

export function PricingGrid({ className }: PricingGridProps) {
  const t = useTranslations("marketing.pricingPage")
  const features = t.raw("features") as string[]
  const {
    packages,
    isLoading,
    isError,
    refetch,
  } = useCreditPackages()

  const packageList = (packages ?? [])
    .filter((pkg) => pkg.active)
    .sort((a, b) => a.credits - b.credits)

  const plans: Plan[] = packageList.map((pkg) => {
    const isPopular = pkg.tags.includes("best-value") || pkg.tags.includes("popular")
    return {
      id: pkg.id,
      name: pkg.name,
      credits: pkg.credits,
      price: pkg.price,
      currency: pkg.currency,
      discount: pkg.discount,
      bonus: pkg.bonus,
      popular: isPopular,
      checkoutUrl: `/checkout?packageId=${pkg.id}`,
    }
  })

  if (isLoading) {
    return (
      <div className={cn("grid md:grid-cols-3 gap-8", className)}>
        {[1, 2, 3].map((item) => (
          <div key={item} className="rounded-2xl border bg-card p-8">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="mt-4 h-10 w-40" />
            <Skeleton className="mt-6 h-8 w-28" />
            <div className="mt-6 space-y-3">
              {[1, 2, 3, 4].map((row) => (
                <Skeleton key={row} className="h-4 w-full" />
              ))}
            </div>
            <Skeleton className="mt-8 h-12 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className={cn("rounded-2xl border bg-card p-8 text-center", className)}>
        <p className="text-sm text-muted-foreground">{t("packagesError")}</p>
        <Button variant="outline" className="mt-4" onClick={() => refetch()}>
          {t("retry")}
        </Button>
      </div>
    )
  }

  if (plans.length === 0) {
    return (
      <div className={cn("rounded-2xl border bg-card p-8 text-center", className)}>
        <p className="text-sm text-muted-foreground">{t("packagesEmpty")}</p>
      </div>
    )
  }

  return (
    <div className={cn("grid md:grid-cols-3 gap-8", className)}>
      {plans.map((plan) => (
        <PricingCard key={plan.id} plan={plan} features={features} />
      ))}
    </div>
  )
}
