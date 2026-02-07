"use client"

import { useState } from "react"
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

const ledgerTypeConfig: Record<LedgerType, { icon: typeof ArrowUpRight; color: string; label: string }> = {
  credit: { icon: ArrowDownLeft, color: "text-success", label: "Nạp" },
  debit: { icon: ArrowUpRight, color: "text-destructive", label: "Sử dụng" },
  refund: { icon: ArrowDownLeft, color: "text-info", label: "Hoàn tiền" },
  bonus: { icon: TrendingUp, color: "text-warning", label: "Thưởng" },
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

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
  const handlePurchase = (packageId: string) => {
    // TODO: Redirect to payment gateway
    console.log("Purchase package:", packageId)
  }

  return (
    <div className="space-y-6">
      {/* Wallet Balance */}
      <SettingsSection title="Số dư hiện tại">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10">
              <Wallet className="size-7 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">
                {wallet.balance.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Credits</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button>
              <Plus className="size-4" />
              Nạp thêm
            </Button>
          </div>
        </div>
      </SettingsSection>

      {/* Credit Packages */}
      <SettingsSection
        title="Gói Credits"
        description="Chọn gói phù hợp với nhu cầu của bạn"
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
                  Giá tốt nhất
                </Badge>
              )}
              {pkg.isPopular && !pkg.isBestValue && (
                <Badge className="absolute -top-2" variant="secondary">
                  Phổ biến
                </Badge>
              )}

              <p className="mt-2 text-2xl font-bold text-foreground">
                {pkg.credits.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Credits</p>

              <div className="mt-3">
                <p className="text-lg font-semibold text-foreground">
                  {formatCurrency(pkg.price)}
                </p>
                {pkg.discount && (
                  <p className="text-xs text-success">Tiết kiệm {pkg.discount}%</p>
                )}
              </div>

              <Button
                size="sm"
                className="mt-3 w-full"
                variant={pkg.isBestValue ? "default" : "outline"}
                onClick={() => handlePurchase(pkg.id)}
              >
                Mua ngay
              </Button>
            </div>
          ))}
        </div>
      </SettingsSection>

      {/* Transaction History */}
      <SettingsSection
        title="Lịch sử giao dịch"
        description="Các giao dịch gần đây"
      >
        {ledger.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Wallet className="mb-2 size-8" />
            <p>Chưa có giao dịch nào</p>
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
                        {entry.amount > 0 ? "+" : ""}{entry.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Số dư: {entry.balanceAfter.toLocaleString()}
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
