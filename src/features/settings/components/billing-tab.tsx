"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslations, useLocale } from "next-intl"
import { useSearchParams } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import {
  Wallet,
  Plus,
  Star,
  ArrowUpRight,
  ArrowDownLeft,
  Loader2,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SettingsSection, SettingsDivider } from "./settings-section"
import { Pagination } from "@/components/ui/pagination"
import {
  useWallet,
  useWalletLedger,
  useCreditPackages,
  usePayments,
  useCreateVnpayPayment,
} from "../hooks/use-billing"
import type { LedgerType, PaymentStatus } from "../types"
import { cn } from "@/lib/utils"
import { walletKeys, billingKeys } from "@/lib/query-client"

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

      {/* Payment History Skeleton */}
      <div className="rounded-lg border bg-card p-6">
        <Skeleton className="mb-1 h-5 w-32" />
        <Skeleton className="mb-4 h-4 w-36" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="text-right space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-16" />
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
  const tCommon = useTranslations("common")
  const locale = useLocale()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()

  // Pagination state
  const [ledgerPage, setLedgerPage] = useState(1)
  const [paymentsPage, setPaymentsPage] = useState(1)

  // Ref for scrolling to credit packages
  const creditPackagesRef = useRef<HTMLDivElement>(null)

  // Data hooks
  const { wallet, isLoading: isLoadingWallet } = useWallet()
  const {
    ledger,
    pagination: ledgerPagination,
    isLoading: isLoadingLedger,
    isFetching: isFetchingLedger,
  } = useWalletLedger({ page: ledgerPage, limit: 10 })
  const { packages, isLoading: isLoadingPackages } = useCreditPackages()
  const {
    payments,
    pagination: paymentsPagination,
    isLoading: isLoadingPayments,
    isFetching: isFetchingPayments,
  } = usePayments({ page: paymentsPage, limit: 10 })
  const { createPayment, isCreating } = useCreateVnpayPayment()

  // VNPay callback banner state
  const [vnpayStatus, setVnpayStatus] = useState<"success" | "error" | "pending" | null>(null)

  useEffect(() => {
    const responseCode = searchParams.get("vnp_ResponseCode")
    if (responseCode) {
      if (responseCode === "00") {
        setVnpayStatus("success")
        // Invalidate wallet + ledger + payments queries to refresh data
        queryClient.invalidateQueries({ queryKey: walletKeys.all })
        queryClient.invalidateQueries({ queryKey: billingKeys.all })
      } else if (responseCode === "24") {
        // User cancelled
        setVnpayStatus("error")
      } else {
        setVnpayStatus("error")
      }
      // Clean up the URL query params without a full page reload
      const url = new URL(window.location.href)
      url.searchParams.delete("vnp_ResponseCode")
      // Remove other VNPay params too
      const vnpParams = Array.from(url.searchParams.keys()).filter((k) => k.startsWith("vnp_"))
      vnpParams.forEach((k) => url.searchParams.delete(k))
      window.history.replaceState({}, "", url.toString())
    }
  }, [searchParams, queryClient])

  const isLoading = isLoadingWallet || isLoadingLedger || isLoadingPackages || isLoadingPayments

  // Show skeleton while loading
  if (isLoading) {
    return <BillingTabSkeleton />
  }

  const ledgerTypeConfig: Record<LedgerType, { icon: typeof ArrowUpRight; color: string; label: string }> = {
    topup: { icon: ArrowDownLeft, color: "text-success", label: t("topUp") },
    spend: { icon: ArrowUpRight, color: "text-destructive", label: t("usage") },
    refund: { icon: ArrowDownLeft, color: "text-info", label: t("refund") },
  }

  const paymentStatusConfig: Record<PaymentStatus, { color: string; label: string }> = {
    pending: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", label: t("paymentStatus.pending") },
    succeeded: { color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", label: t("paymentStatus.succeeded") },
    failed: { color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", label: t("paymentStatus.failed") },
    cancelled: { color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400", label: t("paymentStatus.cancelled") },
  }

  function formatCurrency(amount: number, currency?: string): string {
    const cur = currency ?? (locale === "vi" ? "VND" : "USD")
    return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
      style: "currency",
      currency: cur,
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
    const returnUrl = `${window.location.origin}/${locale}/settings/billing`
    createPayment(
      { packageId, returnUrl },
      {
        onSuccess: (data) => {
          window.location.href = data.paymentUrl
        },
      }
    )
  }

  const handleScrollToPackages = () => {
    creditPackagesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const packageList = packages ?? []
  const ledgerList = ledger ?? []
  const paymentList = payments ?? []

  return (
    <div className="space-y-6">
      {/* VNPay callback banner */}
      {vnpayStatus === "success" && (
        <Alert className="border-success bg-success/10 text-success [&>svg]:text-success">
          <CheckCircle className="size-4" />
          <AlertDescription>{t("vnpaySuccess")}</AlertDescription>
        </Alert>
      )}
      {vnpayStatus === "error" && (
        <Alert variant="destructive">
          <XCircle className="size-4" />
          <AlertDescription>{t("vnpayError")}</AlertDescription>
        </Alert>
      )}
      {vnpayStatus === "pending" && (
        <Alert className="border-yellow-500 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 [&>svg]:text-yellow-600">
          <Clock className="size-4" />
          <AlertDescription>{t("vnpayPending")}</AlertDescription>
        </Alert>
      )}

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
            <Button onClick={handleScrollToPackages}>
              <Plus className="size-4" />
              {t("addMore")}
            </Button>
          </div>
        </div>
      </SettingsSection>

      {/* Credit Packages */}
      <div ref={creditPackagesRef}>
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

                  {pkg.bonus ? (
                    <p className="text-xs text-success">{t("bonusPercent", { percent: pkg.bonus })}</p>
                  ) : null}

                  <div className="mt-3">
                    <p className="text-lg font-semibold text-foreground">
                      {formatCurrency(pkg.price)}
                    </p>
                    {pkg.discount ? (
                      <p className="text-xs text-success">{t("save", { percent: pkg.discount })}</p>
                    ) : null}
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
      </div>

      {/* Transaction History (Ledger) */}
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
                          {config?.label} &middot; {formatDate(entry.createdAt)}
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

        {/* Ledger Pagination */}
        {ledgerPagination && (
          <Pagination
            page={ledgerPagination.page}
            totalPages={ledgerPagination.totalPages}
            hasNext={ledgerPagination.hasNext}
            hasPrev={ledgerPagination.hasPrev}
            onPageChange={setLedgerPage}
            isFetching={isFetchingLedger}
          />
        )}
      </SettingsSection>

      {/* Payment History */}
      <SettingsSection
        title={t("paymentHistory")}
        description={t("paymentHistoryDescription")}
      >
        {paymentList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <CreditCard className="mb-2 size-8" />
            <p>{t("noPayments")}</p>
          </div>
        ) : (
          <div className="space-y-1">
            {paymentList.map((payment, idx) => {
              const statusConfig = paymentStatusConfig[payment.status]
              return (
                <div key={payment.id}>
                  {idx > 0 && <SettingsDivider />}
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <CreditCard className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {payment.package.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {payment.package.credits.toLocaleString(locale === "vi" ? "vi-VN" : "en-US")} {t("credits")} &middot; {formatDate(payment.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <p className="text-sm font-semibold text-foreground">
                        {formatCurrency(payment.amount, payment.currency)}
                      </p>
                      <Badge variant="outline" className={cn("text-xs font-medium", statusConfig?.color)}>
                        {statusConfig?.label ?? payment.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Payments Pagination */}
        {paymentsPagination && (
          <Pagination
            page={paymentsPagination.page}
            totalPages={paymentsPagination.totalPages}
            hasNext={paymentsPagination.hasNext}
            hasPrev={paymentsPagination.hasPrev}
            onPageChange={setPaymentsPage}
            isFetching={isFetchingPayments}
          />
        )}
      </SettingsSection>
    </div>
  )
}
