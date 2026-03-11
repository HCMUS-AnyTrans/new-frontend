"use client"

import { Suspense } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import {
  ForgotPasswordForm,
  SocialLoginButtons,
  AuthCardLayout,
  AuthLoadingFallback,
} from "@/features/auth"

function ForgotPasswordContent() {
  const t = useTranslations("auth.forgotPassword")

  return (
    <AuthCardLayout
      imageSrc="/authen/forgot-password-hero.svg"
      imageAlt="Forgot password illustration"
      i18nNamespace="auth.forgotPassword"
    >
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          {t("title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          <Link
            href="/login"
            className="font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            ← {t("backToLogin")}
          </Link>
        </p>
      </div>

      <ForgotPasswordForm />
      <SocialLoginButtons className="mt-6 max-w-none" />
    </AuthCardLayout>
  )
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<AuthLoadingFallback />}>
      <ForgotPasswordContent />
    </Suspense>
  )
}
