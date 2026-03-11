"use client"

import { Suspense } from "react"
import { useTranslations } from "next-intl"
import {
  ResetPasswordForm,
  AuthCardLayout,
  AuthLoadingFallback,
} from "@/features/auth"

function ResetPasswordContent() {
  const t = useTranslations("auth.resetPassword")

  return (
    <AuthCardLayout
      imageSrc="/authen/reset-password-hero.svg"
      imageAlt="Reset password illustration"
      i18nNamespace="auth.resetPassword"
    >
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          {t("title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      <ResetPasswordForm />
    </AuthCardLayout>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<AuthLoadingFallback />}>
      <ResetPasswordContent />
    </Suspense>
  )
}
