"use client"

import { useMemo, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { Link } from "@/i18n/navigation"
import { Coins, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useCreditPackages } from "@/features/settings"
import { trackEvent } from "@/lib/analytics"
import { cn } from "@/lib/utils"
import { useWallet } from "../hooks"

type BuyCreditsDialogProps = {
  children: React.ReactNode
}

export function BuyCreditsDialog({ children }: BuyCreditsDialogProps) {
  const router = useRouter()
  const t = useTranslations("dashboard.buyCreditsDialog")
  const tQuickActions = useTranslations("dashboard.quickActions")
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null)

  const { wallet } = useWallet()
  const { packages, isLoading, isError, refetch } = useCreditPackages()

  const packageList = useMemo(() => {
    return (packages ?? [])
      .filter((pkg) => pkg.active)
      .sort((a, b) => a.credits - b.credits)
  }, [packages])

  const defaultPackageId = useMemo(() => {
    if (packageList.length === 0) return null
    const bestValue = packageList.find((pkg) => pkg.tags.includes("best-value"))
    return bestValue?.id ?? packageList[Math.floor(packageList.length / 2)]?.id ?? packageList[0]?.id ?? null
  }, [packageList])

  const effectiveSelectedPackageId = selectedPackageId ?? defaultPackageId

  const selectedPackage = useMemo(() => {
    if (!effectiveSelectedPackageId) return null
    return packageList.find((pkg) => pkg.id === effectiveSelectedPackageId) ?? null
  }, [packageList, effectiveSelectedPackageId])

  const numberFormatter = new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US")
  const decimalFormatter = new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
    maximumFractionDigits: 2,
  })

  const formatCurrency = (amount: number, currency: string) => {
    const symbol = currency === "VND" ? "đ" : currency === "USD" ? "$" : currency
    return `${decimalFormatter.format(amount)} ${symbol}`
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) {
          setSelectedPackageId(null)
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="size-5 text-primary" />
            {t("title")}
          </DialogTitle>
          <DialogDescription>
            {t("description", {
              balance: numberFormatter.format(wallet?.balance ?? 0),
            })}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="rounded-xl border p-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="mt-4 h-7 w-28" />
                <Skeleton className="mt-2 h-5 w-20" />
                <Skeleton className="mt-4 h-9 w-full" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-xl border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">{t("loadError")}</p>
            <Button variant="outline" className="mt-4" onClick={() => refetch()}>
              {t("retry")}
            </Button>
          </div>
        ) : packageList.length === 0 ? (
          <div className="rounded-xl border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">{t("empty")}</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/pricing">{t("viewPricing")}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {packageList.map((pkg) => {
              const isSelected = pkg.id === effectiveSelectedPackageId
              const isBestValue = pkg.tags.includes("best-value")

              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => {
                    setSelectedPackageId(pkg.id)
                    trackEvent("buy_credit_package_selected", {
                      source: "dashboard_dialog",
                      packageId: pkg.id,
                      credits: pkg.credits,
                      price: pkg.price,
                      currency: pkg.currency,
                    })
                  }}
                  className={cn(
                    "relative rounded-xl border-2 p-4 text-left transition-colors",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/40"
                  )}
                >
                  {isBestValue ? (
                    <Badge className="absolute -top-2 right-3 gap-1 bg-warning text-warning-foreground">
                      <Star className="size-3" />
                      {t("bestValue")}
                    </Badge>
                  ) : null}
                  <p className="text-sm text-muted-foreground">{pkg.name}</p>
                  <p className="mt-1 text-xl font-bold text-foreground">
                    {numberFormatter.format(pkg.credits)} {t("credits")}
                  </p>
                  <p className="mt-2 text-base font-semibold text-foreground">
                    {formatCurrency(pkg.price, pkg.currency)}
                  </p>
                  <p className="mt-1 text-xs text-primary">
                    ~{formatCurrency(pkg.price / Math.max(pkg.credits, 1), pkg.currency)}/{t("perCredit")}
                  </p>
                </button>
              )
            })}
          </div>
        )}

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" asChild>
            <Link href="/pricing">{t("viewPricing")}</Link>
          </Button>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              {t("cancel")}
            </Button>
            <Button
              disabled={!selectedPackage}
              onClick={() => {
                if (!selectedPackage) return
                trackEvent("buy_credit_checkout_started", {
                  source: "dashboard_dialog",
                  packageId: selectedPackage.id,
                })
                setOpen(false)
                router.push(`/checkout?packageId=${selectedPackage.id}&source=dashboard`)
              }}
            >
              {tQuickActions("buyCredits")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
