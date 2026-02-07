"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Check, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
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
  return (
    <div
      className={cn(
        "relative",
        plan.popular && "md:-mt-4 md:mb-[-16px]",
        className
      )}
    >
      {/* Card with hover effect */}
      <div
        className={cn(
          "relative h-full bg-card rounded-2xl border p-8 transition-colors duration-300 cursor-pointer",
          "hover:shadow-xl",
          plan.popular
            ? "border-primary shadow-xl shadow-primary/10 pt-12"
            : "border-border shadow-lg"
        )}
      >
        {/* Popular Badge */}
        {plan.popular && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-lg">
              <Star className="w-4 h-4 fill-current" />
              {t("popular")}
            </span>
          </div>
        )}

        {/* Plan Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
          <p className="text-2xl font-extrabold text-primary mt-2">
            {plan.credits}{" "}
            <span className="text-base font-medium text-muted-foreground">
              {t("credits")}
            </span>
          </p>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-foreground">
              {plan.price}
            </span>
            <span className="text-muted-foreground">đ</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm font-medium text-primary">
              {plan.unitPrice}/credit
            </span>
          </div>
          {plan.savings && (
            <span className="inline-block mt-3 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-semibold border border-success/20">
              {plan.savings}
            </span>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-8">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Button
          className={cn(
            "w-full h-12 group",
            plan.popular && "shadow-lg shadow-primary/20"
          )}
          variant={plan.popular ? "default" : "outline"}
          asChild
        >
          <Link
            href={plan.checkoutUrl}
            className="flex items-center justify-center gap-2"
          >
            {t("buyNow")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
