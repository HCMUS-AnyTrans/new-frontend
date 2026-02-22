"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronLeft } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  ForgotPasswordForm,
  SocialLoginButtons,
  AuthHero,
} from "@/features/auth"

export default function ForgotPasswordPage() {
  const t = useTranslations("auth.forgotPassword")

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Logo */}
      <div className="absolute top-12 left-12 z-20">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-10 h-10">
            <Image
              src="/logo.svg"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="font-bold text-2xl text-primary">AnyTrans</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left Column - Forgot Password Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start">
              <div className="w-full max-w-[512px] space-y-8">
                {/* Back to Login Link */}
                <Link
                  href="/login"
                  className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  {t("backToLogin")}
                </Link>

                {/* Header */}
                <div className="space-y-4">
                  <h1 className="text-4xl font-semibold text-foreground">
                    {t("title")}
                  </h1>
                  <p className="text-base text-muted-foreground">
                    {t("subtitle")}
                  </p>
                </div>

                {/* Forgot Password Form - uses hooks internally */}
                <ForgotPasswordForm />

                {/* Social Login - uses hooks internally */}
                <SocialLoginButtons />
              </div>
            </div>

            {/* Right Column - Hero Illustration */}
            <AuthHero
              imageSrc="/authen/forgot-password-hero.svg"
              imageAlt="Forgot password illustration"
              className="w-full lg:w-1/2"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
