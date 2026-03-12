"use client"

import { useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { Check, Star, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditPackageCard } from "@/components/shared"
import {
  createCreditPackageFormatter,
  createCreditPackageViewModel,
} from "@/lib/credit-package"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/features/auth"
import { useCreateVnpayPayment } from "@/features/settings"
import { trackEvent } from "@/lib/analytics"
import type { Plan } from "../data"

export interface PricingCardProps {
  plan: Plan
  features: string[]
  className?: string
}

export function PricingCard({
  plan,
  features,
  className,
}: PricingCardProps) {
  const t = useTranslations("marketing.pricingPage")
  const locale = useLocale()
  const router = useRouter()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const { createPaymentAsync, isCreating } = useCreateVnpayPayment()
  const [paymentError, setPaymentError] = useState<string | null>(null)

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
    setPaymentError(null)
    trackEvent("buy_credit_payment_submit", { source: "pricing", packageId: plan.id })
    try {
      const returnUrl = `${window.location.origin}/${locale}/settings/billing`
      const data = await createPaymentAsync({ packageId: plan.id, returnUrl })
      trackEvent("buy_credit_redirect_vnpay", { source: "pricing", packageId: plan.id, paymentId: data.paymentId })
      window.location.href = data.paymentUrl
    } catch {
      trackEvent("buy_credit_payment_failed", { source: "pricing", packageId: plan.id })
      setPaymentError(t("paymentError"))
    }
  }

  const { formatCredits, formatAmount, formatPerCredit } = createCreditPackageFormatter(locale)
  const packageView = createCreditPackageViewModel({
    id: plan.id,
    name: plan.name,
    credits: plan.credits,
    price: plan.price,
    currency: plan.currency,
    discount: plan.discount ?? null,
    bonus: plan.bonus ?? null,
    tags: plan.popular ? ["popular"] : [],
  })

  const creditsLabel = formatCredits(packageView.credits)

  return (
    <div
      className={cn(
        "relative",
        plan.popular && "md:-mt-4 md:mb-[-16px]",
        className
      )}
    >
      <CreditPackageCard
        layout="marketing"
        highlighted={plan.popular}
        title={plan.name}
        creditsText={creditsLabel}
        creditsLabel={t("credits")}
        originalPriceText={packageView.discountPercent ? formatAmount(packageView.price, packageView.currency) : undefined}
        priceText={formatAmount(packageView.discountedPrice, packageView.currency)}
        perCreditText={formatPerCredit(packageView.unitPrice, packageView.currency, t("perCredit"))}
        topBadge={plan.popular ? {
          label: t("popular"),
          icon: <Star className="size-4 fill-current" />,
          tone: "primary",
          placement: "top-center",
        } : undefined}
        metaBadges={
          packageView.discountPercent || packageView.bonusPercent ? (
            <>
              {packageView.discountPercent ? (
                <Badge className="border border-success/20 bg-success/10 text-success hover:bg-success/10">
                  {t("savePercent", { percent: packageView.discountPercent })}
                </Badge>
              ) : null}
              {packageView.bonusPercent ? (
                <Badge className="border border-primary/20 bg-primary/10 text-primary hover:bg-primary/10">
                  {t("bonusCredits", { credits: packageView.bonusCredits })}
                </Badge>
              ) : null}
            </>
          ) : null
        }
        details={
          <ul className="space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success">
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                </div>
                <span className="text-sm text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        }
        action={
          <div className="flex flex-col gap-2">
            <Button
              className={cn("group h-12 w-full", plan.popular && "shadow-lg shadow-primary/20")}
              variant={plan.popular ? "default" : "outline"}
              onClick={handleBuyNow}
              disabled={isCreating}
            >
              <span className="flex items-center justify-center gap-2">
                {isCreating ? t("processing") : t("buyNow")}
                {!isCreating && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
              </span>
            </Button>
            {paymentError && (
              <p className="text-xs text-destructive text-center">{paymentError}</p>
            )}
          </div>
        }
      />
    </div>
  )
}
