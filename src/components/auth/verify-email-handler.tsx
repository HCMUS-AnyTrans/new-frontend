"use client"

import { useEffect, useState, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { authValidationMessages } from "@/data/auth"
import { useVerifyEmail, useResendEmail } from "@/features/authentication"
import { Loader2, CheckCircle2, XCircle, Mail } from "lucide-react"

export interface VerifyEmailHandlerProps {
  className?: string
  redirectDelay?: number // seconds before redirect
}

type VerifyState = "loading" | "success" | "error" | "invalid"

export function VerifyEmailHandler({
  className,
  redirectDelay = 3,
}: VerifyEmailHandlerProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const email = searchParams.get("email") || ""
  const token = searchParams.get("token") || ""

  const [state, setState] = useState<VerifyState>("loading")
  const [countdown, setCountdown] = useState(redirectDelay)
  const [resendSuccess, setResendSuccess] = useState(false)

  // Verify email hook
  const {
    verifyEmail,
    isLoading: isVerifying,
    isSuccess: verifySuccess,
    error: verifyError,
  } = useVerifyEmail({
    onSuccess: () => setState("success"),
    onError: () => setState("error"),
    redirectTo: undefined, // We handle redirect manually with countdown
  })

  // Resend email hook
  const {
    resendEmail,
    isLoading: isResending,
    isSuccess: resendEmailSuccess,
    error: resendError,
  } = useResendEmail({
    onSuccess: () => setResendSuccess(true),
  })

  // Check for valid params on mount
  const hasValidParams = Boolean(email && token)

  // Auto verify on mount
  useEffect(() => {
    if (!hasValidParams) {
      setState("invalid")
      return
    }

    // Trigger verification
    verifyEmail({ email, token })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Countdown and redirect after success
  useEffect(() => {
    if (state !== "success") return

    if (countdown <= 0) {
      router.push("/login")
      return
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [state, countdown, router])

  // Handle resend email
  const handleResendEmail = useCallback(() => {
    if (!email) return
    setResendSuccess(false)
    resendEmail({ email, type: "email_verification" })
  }, [email, resendEmail])

  // Invalid params state
  if (state === "invalid") {
    return (
      <div className={cn("w-full max-w-[512px]", className)}>
        <div className="bg-destructive/10 border border-destructive text-destructive px-6 py-5 rounded-lg text-sm space-y-3">
          <div className="flex items-center gap-3">
            <XCircle className="h-6 w-6 flex-shrink-0" />
            <p className="font-semibold text-base">
              {authValidationMessages.verifyEmailInvalidLink}
            </p>
          </div>
          <p className="text-muted-foreground pl-9">
            {authValidationMessages.verifyEmailInvalidLinkDescription}
          </p>
          <div className="pl-9 pt-2">
            <Link
              href="/login"
              className="inline-block text-primary hover:text-primary/80 transition-colors font-semibold"
            >
              Quay lại trang đăng nhập →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (state === "loading" || isVerifying) {
    return (
      <div className={cn("w-full max-w-[512px]", className)}>
        <div className="bg-muted/50 border border-border px-6 py-8 rounded-lg text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-lg font-medium">
            {authValidationMessages.verifyEmailLoading}
          </p>
          <p className="text-muted-foreground text-sm">
            Vui lòng đợi trong giây lát...
          </p>
        </div>
      </div>
    )
  }

  // Success state
  if (state === "success") {
    return (
      <div className={cn("w-full max-w-[512px]", className)}>
        <div className="bg-success/10 border border-success px-6 py-5 rounded-lg text-sm space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-success" />
            <p className="font-semibold text-base text-success">
              {authValidationMessages.verifyEmailSuccess}
            </p>
          </div>
          <p className="text-muted-foreground pl-9">
            {authValidationMessages.verifyEmailSuccessDescription}{" "}
            <span className="font-semibold text-foreground">{countdown}</span> giây...
          </p>
          <div className="pl-9 pt-2">
            <Link
              href="/login"
              className="inline-block text-primary hover:text-primary/80 transition-colors font-semibold"
            >
              Đi đến trang đăng nhập ngay →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  return (
    <div className={cn("w-full max-w-[512px]", className)}>
      <div className="bg-destructive/10 border border-destructive px-6 py-5 rounded-lg text-sm space-y-4">
        <div className="flex items-center gap-3">
          <XCircle className="h-6 w-6 flex-shrink-0" />
          <p className="font-semibold text-base">
            {authValidationMessages.verifyEmailFailed}
          </p>
        </div>
        <p className="text-muted-foreground pl-9">
          {verifyError || "Liên kết xác thực có thể đã hết hạn. Vui lòng yêu cầu gửi lại email xác thực."}
        </p>

        {/* Resend email section */}
        {email && (
          <div className="pl-9 pt-2 space-y-3">
            {resendSuccess ? (
              <div className="flex items-center gap-2 text-success">
                <Mail className="h-4 w-4" />
                <span className="font-medium">
                  {authValidationMessages.verifyEmailResendSuccess}
                </span>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={handleResendEmail}
                disabled={isResending}
                className="gap-2"
              >
                {isResending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    {authValidationMessages.verifyEmailResendButton}
                  </>
                )}
              </Button>
            )}

            {resendError && (
              <p className="text-destructive text-sm">
                {resendError}
              </p>
            )}
          </div>
        )}

        <div className="pl-9 pt-1">
          <Link
            href="/login"
            className="inline-block text-primary hover:text-primary/80 transition-colors font-semibold"
          >
            Quay lại trang đăng nhập →
          </Link>
        </div>
      </div>
    </div>
  )
}
