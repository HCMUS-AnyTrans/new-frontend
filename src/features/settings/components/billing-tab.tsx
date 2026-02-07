"use client"

import { useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { Wallet, Plus, Star, TrendingUp, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SettingsSection, SettingsDivider } from "./settings-section"
import {
  mockWallet,
  mockWalletLedger,
  mockCreditPackages,
} from "../data"
import type { Wallet as WalletType, WalletLedger, CreditPackage, LedgerType } from "../types"
import { cn } from "@/lib/utils"

interface BillingTabProps {
  wallet?: WalletType
  ledger?: WalletLedger[]
  packages?: CreditPackage[]
}

export function BillingTab({
  wallet = mockWallet,
  ledger = mockWalletLedger,
  packages = mockCreditPackages,
}: BillingTabProps) {
  const t = useTranslations("settings.billing")
  const locale = useLocale()

  const ledgerTypeConfig: Record<LedgerType, { icon: typeof ArrowUpRight; color: string; label: string }> = {
    credit: { icon: ArrowDownLeft, color: "text-success", label: t("topUp") },
    debit: { icon: ArrowUpRight, color: "text-destructive", label: t("usage") },
    refund: { icon: ArrowDownLeft, color: "text-info", label: t("refund") },
    bonus: { icon: TrendingUp, color: "text-warning", label: t("bonus") },
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
    // TODO: Redirect to payment gateway
    console.log("Purchase package:", packageId)
  }

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
                {wallet.balance.toLocaleString(locale === "vi" ? "vi-VN" : "en-US")}
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
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={cn(
                "relative flex flex-col items-center rounded-xl border-2 p-4 text-center transition-all",
                pkg.isBestValue
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              )}
            >
              {pkg.isBestValue && (
                <Badge className="absolute -top-2 gap-1 bg-warning text-warning-foreground">
                  <Star className="size-3" />
                  {t("bestValue")}
                </Badge>
              )}
              {pkg.isPopular && !pkg.isBestValue && (
                <Badge className="absolute -top-2" variant="secondary">
                  {t("popular")}
                </Badge>
              )}

              <p className="mt-2 text-2xl font-bold text-foreground">
                {pkg.credits.toLocaleString(locale === "vi" ? "vi-VN" : "en-US")}
              </p>
              <p className="text-sm text-muted-foreground">{t("credits")}</p>

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
                variant={pkg.isBestValue ? "default" : "outline"}
                onClick={() => handlePurchase(pkg.id)}
              >
                {t("buyNow")}
              </Button>
            </div>
          ))}
        </div>
      </SettingsSection>

      {/* Transaction History */}
      <SettingsSection
        title={t("transactionHistory")}
        description={t("recentTransactions")}
      >
        {ledger.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Wallet className="mb-2 size-8" />
            <p>{t("noTransactions")}</p>
          </div>
        ) : (
          <div className="space-y-1">
            {ledger.map((entry, idx) => {
              const config = ledgerTypeConfig[entry.type]
              const Icon = config.icon
              return (
                <div key={entry.id}>
                  {idx > 0 && <SettingsDivider />}
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className={cn("flex size-9 items-center justify-center rounded-lg bg-muted", config.color)}>
                        <Icon className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {entry.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(entry.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn("font-semibold", entry.amount > 0 ? "text-success" : "text-foreground")}>
                        {entry.amount > 0 ? "+" : ""}{entry.amount.toLocaleString(locale === "vi" ? "vi-VN" : "en-US")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("balance")}: {entry.balanceAfter.toLocaleString(locale === "vi" ? "vi-VN" : "en-US")}
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
