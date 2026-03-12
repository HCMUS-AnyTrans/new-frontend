"use client"

import { Suspense } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import {
  RegisterForm,
  AuthCardLayout,
  AuthLoadingFallback,
  AuthRedirect,
} from "@/features/auth"

function RegisterContent() {
  const t = useTranslations("auth.register")

  return (
    <AuthCardLayout
      imageSrc="/authen/register-hero.svg"
      imageAlt="Register illustration"
      i18nNamespace="auth.register"
      formPanelScroll
      formOnLeft
    >
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          {t("title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("hasAccount")}{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            {t("signIn")}
          </Link>
        </p>
      </div>

      <RegisterForm hideLoginLink />
    </AuthCardLayout>
  )
}

export default function RegisterPage() {
  return (
    <AuthRedirect>
      <Suspense fallback={<AuthLoadingFallback />}>
        <RegisterContent />
      </Suspense>
    </AuthRedirect>
  )
}
