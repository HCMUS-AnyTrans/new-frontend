"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { useSearchParams } from "next/navigation"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { ProtectedRoute } from "@/features/auth"
import { useCreditPackages, useCreateVnpayPayment } from "@/features/settings"
import { trackEvent } from "@/lib/analytics"

function CheckoutContent() {
  const t = useTranslations("marketing.checkout")
  const tPricing = useTranslations("marketing.pricingPage")
  const locale = useLocale()
  const searchParams = useSearchParams()
  const packageId = searchParams.get("packageId")
  const source = searchParams.get("source")
  const isDashboardSource = source === "dashboard"
  const backHref = isDashboardSource ? "/dashboard" : "/pricing"
  const backLabel = isDashboardSource ? t("backToDashboard") : t("backToPricing")

  const { packages, isLoading, isError, refetch } = useCreditPackages()
  const { createPaymentAsync, isCreating } = useCreateVnpayPayment()
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const hasTrackedView = useRef(false)

  const selectedPackage = useMemo(() => {
    if (!packageId) return null
    return packages?.find((pkg) => pkg.id === packageId) ?? null
  }, [packages, packageId])

  const numberFormatter = new Intl.NumberFormat(
    locale === "vi" ? "vi-VN" : "en-US",
    { maximumFractionDigits: 2 }
  )

  const formatCredits = (value: number) =>
    new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US").format(value)

  const formatAmount = (value: number, currency: string) => {
    const symbol =
      currency === "VND"
        ? "đ"
        : currency === "USD"
          ? "$"
          : currency
    return `${numberFormatter.format(value)} ${symbol}`
  }

  const handlePay = async () => {
    if (!selectedPackage) return
    setPaymentError(null)
    trackEvent("buy_credit_payment_submit", {
      source: source ?? "checkout",
      packageId: selectedPackage.id,
    })
    try {
      const returnUrl = `${window.location.origin}/${locale}/settings/billing${
        isDashboardSource ? "?source=dashboard" : ""
      }`
      const data = await createPaymentAsync({
        packageId: selectedPackage.id,
        returnUrl,
      })
      trackEvent("buy_credit_redirect_vnpay", {
        source: source ?? "checkout",
        packageId: selectedPackage.id,
        paymentId: data.paymentId,
      })
      window.location.href = data.paymentUrl
    } catch {
      trackEvent("buy_credit_payment_failed", {
        source: source ?? "checkout",
        packageId: selectedPackage.id,
      })
      setPaymentError(t("paymentError"))
    }
  }

  useEffect(() => {
    if (!selectedPackage || hasTrackedView.current) return
    hasTrackedView.current = true
    trackEvent("buy_credit_checkout_viewed", {
      source: source ?? "checkout",
      packageId: selectedPackage.id,
      credits: selectedPackage.credits,
      price: selectedPackage.price,
      currency: selectedPackage.currency,
    })
  }, [selectedPackage, source])

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold text-foreground">
            {t("title")}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        {isLoading ? (
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-40" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ) : isError ? (
          <Alert variant="destructive">
            <AlertDescription className="flex flex-col gap-4">
              <span>{t("packagesError")}</span>
              <Button variant="outline" onClick={() => refetch()}>
                {t("retry")}
              </Button>
            </AlertDescription>
          </Alert>
        ) : !packageId || !selectedPackage ? (
          <Alert>
            <AlertDescription className="flex flex-col gap-4">
              <span>{t("packageNotFound")}</span>
              <Button asChild variant="outline">
                <Link href={backHref}>{backLabel}</Link>
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-xl">{selectedPackage.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">
                    {tPricing("credits")}
                  </span>
                  <span className="text-lg font-semibold text-foreground">
                    {formatCredits(selectedPackage.credits)}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t("total")}
                  </span>
                  <span className="text-2xl font-bold text-foreground">
                    {formatAmount(selectedPackage.price, selectedPackage.currency)}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t("perCredit")}
                  </span>
                  <span className="text-sm font-medium text-primary">
                    ~{formatAmount(
                      selectedPackage.price / Math.max(selectedPackage.credits, 1),
                      selectedPackage.currency
                    )}
                  </span>
                </div>
              </div>

              {selectedPackage.discount ? (
                <div className="rounded-lg border border-success/20 bg-success/10 px-4 py-3 text-sm text-success">
                  {t("discount", { percent: selectedPackage.discount })}
                </div>
              ) : null}

              {selectedPackage.bonus ? (
                <div className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
                  {t("bonus", { percent: selectedPackage.bonus })}
                </div>
              ) : null}

              {selectedPackage.description?.length ? (
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {selectedPackage.description.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 size-1.5 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {paymentError ? (
                <Alert variant="destructive">
                  <AlertDescription>{paymentError}</AlertDescription>
                </Alert>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  className="flex-1"
                  onClick={handlePay}
                  disabled={isCreating}
                >
                  {isCreating ? t("processing") : t("payNow")}
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href={backHref}>{backLabel}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  )
}
