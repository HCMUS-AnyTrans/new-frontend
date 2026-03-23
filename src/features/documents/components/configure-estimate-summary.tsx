"use client"

import { useTranslations } from "next-intl"
import { AppCard, AppCardContent } from "@/components/ui/app-card"
import { cn } from "@/lib/utils"
import type { CreditEstimateResponse } from "../types"

interface ConfigureEstimateSummaryProps {
  estimate: CreditEstimateResponse
  isInsufficientCredits: boolean
  missingCredits: number
}

export function ConfigureEstimateSummary({
  estimate,
  isInsufficientCredits,
  missingCredits,
}: ConfigureEstimateSummaryProps) {
  const t = useTranslations("documents.configure")

  return (
    <AppCard className="xl:hidden">
      <AppCardContent className="space-y-2 pt-4">
        <div
          className={cn(
            "flex items-center justify-between rounded-lg border p-3",
            isInsufficientCredits ? "border-destructive/40 bg-destructive/5" : "bg-muted/30"
          )}
        >
          <p className={cn("text-sm", isInsufficientCredits ? "text-destructive" : "text-muted-foreground")}>
            {t("estimate.total")}
          </p>
          <p className={cn("text-lg font-semibold", isInsufficientCredits ? "text-destructive" : "text-foreground")}>
            {estimate.totalCredits.toLocaleString()} {t("estimate.credits")}
          </p>
        </div>
        {isInsufficientCredits ? (
          <p className="text-xs font-medium text-destructive">
            {t("estimate.insufficientCredits", { missing: missingCredits.toLocaleString() })}
          </p>
        ) : null}
      </AppCardContent>
    </AppCard>
  )
}
