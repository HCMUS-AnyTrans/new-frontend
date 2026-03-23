"use client"

import { useTranslations } from "next-intl"
import { CardTitle } from "@/components/ui/card"
import { AppCard, AppCardContent, AppCardHeader } from "@/components/ui/app-card"
import type { CreditEstimateResponse } from "../types"

interface ConfigureEstimateCardProps {
  isEstimating: boolean
  estimate: CreditEstimateResponse | undefined
  estimateError: string | null
  isInsufficientCredits: boolean
  missingCredits: number
  currentBalance?: number
  isLoadingBalance?: boolean
}

export function ConfigureEstimateCard({
  isEstimating,
  estimate,
  estimateError,
  isInsufficientCredits,
  missingCredits,
  currentBalance,
  isLoadingBalance,
}: ConfigureEstimateCardProps) {
  const t = useTranslations("documents.configure")

  return (
    <AppCard>
      <AppCardHeader>
        <CardTitle className="text-base">{t("estimate.title")}</CardTitle>
      </AppCardHeader>
      <AppCardContent className="space-y-3">
        {isEstimating ? (
          <p className="text-sm text-muted-foreground">{t("estimate.loading")}</p>
        ) : null}

        {!isEstimating && estimate ? (
          <>
            <div
              className={
                isInsufficientCredits
                  ? "rounded-lg border border-destructive/40 bg-destructive/5 p-3"
                  : "rounded-lg border bg-muted/30 p-3"
              }
            >
              <p className={isInsufficientCredits ? "text-sm text-destructive" : "text-sm text-muted-foreground"}>
                {t("estimate.total")}
              </p>
              <p className={isInsufficientCredits ? "text-xl font-semibold text-destructive" : "text-xl font-semibold text-foreground"}>
                {estimate.totalCredits.toLocaleString()} {t("estimate.credits")}
              </p>
            </div>

            <div className="space-y-1 rounded-lg border bg-muted/20 p-3">
              <p className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{t("estimate.currentBalance")}</span>
                <span className="font-medium text-foreground">
                  {isLoadingBalance
                    ? t("estimate.balanceLoading")
                    : typeof currentBalance === "number"
                      ? `${currentBalance.toLocaleString()} ${t("estimate.credits")}`
                      : "-"}
                </span>
              </p>
              {isInsufficientCredits ? (
                <p className="text-xs font-medium text-destructive">
                  {t("estimate.insufficientCredits", { missing: missingCredits.toLocaleString() })}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              {estimate.breakdown.map((item) => (
                <div key={item.code} className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="pr-2">{item.name}</span>
                  <span className="whitespace-nowrap font-medium text-foreground">
                    {item.credits.toLocaleString()} {t("estimate.credits")}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{t("estimate.note")}</p>
          </>
        ) : null}

        {!isEstimating && !estimate && estimateError ? (
          <p className="text-sm text-destructive">{estimateError}</p>
        ) : null}
      </AppCardContent>
    </AppCard>
  )
}
