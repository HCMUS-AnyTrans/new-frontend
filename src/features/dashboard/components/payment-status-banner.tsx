"use client"

import { useEffect, useMemo, useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useQueryClient } from "@tanstack/react-query"
import { CheckCircle, Clock, XCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { billingKeys, dashboardKeys, walletKeys } from "@/lib/query-client"
import { trackEvent } from "@/lib/analytics"

type BannerStatus = "success" | "error" | "pending" | null

export function PaymentStatusBanner() {
  const t = useTranslations("dashboard.paymentBanner")
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const queryClient = useQueryClient()
  const hasTracked = useRef(false)

  const source = searchParams.get("source")
  const rawStatus = searchParams.get("paymentStatus")

  const status = useMemo<BannerStatus>(() => {
    if (source !== "dashboard") return null
    if (rawStatus === "success" || rawStatus === "error" || rawStatus === "pending") {
      return rawStatus
    }
    return null
  }, [source, rawStatus])

  useEffect(() => {
    if (!status || hasTracked.current) return
    hasTracked.current = true

    trackEvent("buy_credit_dashboard_banner_viewed", {
      source: "dashboard",
      status,
    })

    if (status === "success") {
      queryClient.invalidateQueries({ queryKey: walletKeys.all })
      queryClient.invalidateQueries({ queryKey: billingKeys.all })
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
    }
  }, [status, queryClient])

  if (!status) return null

  const dismiss = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("source")
    params.delete("paymentStatus")
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname)
  }

  if (status === "success") {
    return (
      <Alert className="border-success bg-success/10 text-success [&>svg]:text-success">
        <CheckCircle className="size-4" />
        <AlertDescription className="flex items-center gap-3">
          <span>{t("success")}</span>
          <Button variant="outline" size="sm" onClick={dismiss}>
            {t("dismiss")}
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (status === "pending") {
    return (
      <Alert className="border-yellow-500 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 [&>svg]:text-yellow-600">
        <Clock className="size-4" />
        <AlertDescription className="flex items-center gap-3">
          <span>{t("pending")}</span>
          <Button variant="outline" size="sm" onClick={dismiss}>
            {t("dismiss")}
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert variant="destructive">
      <XCircle className="size-4" />
      <AlertDescription className="flex items-center gap-3">
        <span>{t("error")}</span>
        <Button variant="outline" size="sm" onClick={dismiss}>
          {t("dismiss")}
        </Button>
      </AlertDescription>
    </Alert>
  )
}
