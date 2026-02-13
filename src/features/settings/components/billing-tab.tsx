"use client"

import { useTranslations, useLocale } from "next-intl"
import { Wallet, Plus, Star, TrendingUp, ArrowUpRight, ArrowDownLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { SettingsSection, SettingsDivider } from "./settings-section"
import {
  useWallet,
  useWalletLedger,
  useCreditPackages,
  useCreateVnpayPayment,
} from "../hooks/use-billing"
import type { LedgerType } from "../types"
import { cn } from "@/lib/utils"

// ============================================================================
// Skeleton Loading State
// ============================================================================

function BillingTabSkeleton() {
  return (
    <div className="space-y-6">
      {/* Wallet Balance Skeleton */}
      <div className="rounded-lg border bg-card p-6">
        <Skeleton className="mb-4 h-5 w-24" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="size-14 rounded-xl" />
            <div className="space-y-1">
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      {/* Credit Packages Skeleton */}
      <div className="rounded-lg border bg-card p-6">
        <Skeleton className="mb-1 h-5 w-28" />
        <Skeleton className="mb-4 h-4 w-48" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center rounded-xl border-2 p-4">
              <Skeleton className="mt-2 h-7 w-16" />
              <Skeleton className="mt-1 h-4 w-12" />
              <Skeleton className="mt-3 h-5 w-20" />
              <Skeleton className="mt-3 h-8 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History Skeleton */}
      <div className="rounded-lg border bg-card p-6">
        <Skeleton className="mb-1 h-5 w-32" />
        <Skeleton className="mb-4 h-4 w-36" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>
              <div className="text-right space-y-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export function BillingTab() {
  const t = useTranslations("settings.billing")
  const locale = useLocale()

  // Data hooks
  const { wallet, isLoading: isLoadingWallet } = useWallet()
  const { ledger, isLoading: isLoadingLedger } = useWalletLedger()
  const { packages, isLoading: isLoadingPackages } = useCreditPackages()
  const { createPayment, isCreating } = useCreateVnpayPayment()

  const isLoading = isLoadingWallet || isLoadingLedger || isLoadingPackages

  // Show skeleton while loading
  if (isLoading) {
    return <BillingTabSkeleton />
  }

  const ledgerTypeConfig: Record<LedgerType, { icon: typeof ArrowUpRight; color: string; label: string }> = {
    topup: { icon: ArrowDownLeft, color: "text-success", label: t("topUp") },
    spend: { icon: ArrowUpRight, color: "text-destructive", label: t("usage") },
    refund: { icon: ArrowDownLeft, color: "text-info", label: t("refund") },
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
      style: "currency",
      currency: locale === "vi" ? "VND" : "USD",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handlePurchase = (packageId: string) => {
    const returnUrl = `${window.location.origin}/settings/billing`
    createPayment(
      { packageId, returnUrl },
      {
        onSuccess: (data) => {
          window.location.href = data.paymentUrl
        },
      }
    )
  }

  const packageList = packages ?? []
  const ledgerList = ledger ?? []

  return (
    <div className="space-y-6">
      {/* Wallet Balance */}
      <SettingsSection title={t("currentBalance")}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10">
              <Wallet className="size-7 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">
                {(wallet?.balance ?? 0).toLocaleString(locale === "vi" ? "vi-VN" : "en-US")}
              </p>
              <p className="text-sm text-muted-foreground">{t("credits")}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button>
              <Plus className="size-4" />
              {t("addMore")}
            </Button>
          </div>
        </div>
      </SettingsSection>

      {/* Credit Packages */}
      <SettingsSection
        title={t("creditPackages")}
        description={t("creditPackagesDescription")}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {packageList.map((pkg) => {
            const isBestValue = pkg.tags.includes("best-value")
            const isPopular = pkg.tags.includes("popular")

            return (
              <div
                key={pkg.id}
                className={cn(
                  "relative flex flex-col items-center rounded-xl border-2 p-4 text-center transition-all",
                  isBestValue
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card"
                )}
              >
                {isBestValue && (
                  <Badge className="absolute -top-2 gap-1 bg-warning text-warning-foreground">
                    <Star className="size-3" />
                    {t("bestValue")}
                  </Badge>
                )}
                {isPopular && !isBestValue && (
                  <Badge className="absolute -top-2" variant="secondary">
                    {t("popular")}
                  </Badge>
                )}

                <p className="mt-2 text-2xl font-bold text-foreground">
                  {pkg.credits.toLocaleString(locale === "vi" ? "vi-VN" : "en-US")}
                </p>
                <p className="text-sm text-muted-foreground">{t("credits")}</p>

                {pkg.bonus && (
                  <p className="text-xs text-success">+{pkg.bonus}% bonus</p>
                )}

                <div className="mt-3">
                  <p className="text-lg font-semibold text-foreground">
                    {formatCurrency(pkg.price)}
                  </p>
                  {pkg.discount && (
                    <p className="text-xs text-success">{t("save", { percent: pkg.discount })}</p>
                  )}
                </div>

                <Button
                  size="sm"
                  className="mt-3 w-full"
                  variant={isBestValue ? "default" : "outline"}
                  onClick={() => handlePurchase(pkg.id)}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : null}
                  {t("buyNow")}
                </Button>
              </div>
            )
          })}
        </div>
      </SettingsSection>

      {/* Transaction History */}
      <SettingsSection
        title={t("transactionHistory")}
        description={t("recentTransactions")}
      >
        {ledgerList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Wallet className="mb-2 size-8" />
            <p>{t("noTransactions")}</p>
          </div>
        ) : (
          <div className="space-y-1">
            {ledgerList.map((entry, idx) => {
              const config = ledgerTypeConfig[entry.ledgerType]
              const Icon = config?.icon ?? ArrowUpRight
              return (
                <div key={entry.id}>
                  {idx > 0 && <SettingsDivider />}
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className={cn("flex size-9 items-center justify-center rounded-lg bg-muted", config?.color)}>
                        <Icon className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {entry.note}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(entry.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn("font-semibold", entry.delta > 0 ? "text-success" : "text-foreground")}>
                        {entry.delta > 0 ? "+" : ""}{entry.delta.toLocaleString(locale === "vi" ? "vi-VN" : "en-US")}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </SettingsSection>
    </div>
  )
}
