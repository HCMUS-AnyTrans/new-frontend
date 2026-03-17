"use client"

import { Suspense } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import {
  LoginForm,
  SocialLoginButtons,
  AuthCardLayout,
  AuthLoadingFallback,
  AuthRedirect,
} from "@/features/auth"

function LoginContent() {
  const t = useTranslations("auth.login")

  return (
    <AuthCardLayout
      imageSrc="/authen/login-hero.svg"
      imageAlt="Login illustration"
      i18nNamespace="auth.login"
    >
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          {t("title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("noAccount")}{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            {t("signUp")}
          </Link>
        </p>
      </div>

      <LoginForm hideSocialLink />
      <SocialLoginButtons className="mt-6 max-w-none" />
    </AuthCardLayout>
  )
}

export default function LoginPage() {
  return (
    <AuthRedirect>
      <Suspense fallback={<AuthLoadingFallback />}>
        <LoginContent />
      </Suspense>
    </AuthRedirect>
  )
}
