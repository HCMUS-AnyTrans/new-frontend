"use client"

import Link from "next/link"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { RegisterForm, SocialLoginButtons, AuthHero, AuthRedirect } from "@/features/auth"

export default function RegisterPage() {
  const t = useTranslations("auth.register")

  return (
    <AuthRedirect>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Logo - positioned top right for register */}
        <div className="absolute top-12 right-12 z-20">
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
              {/* Left Column - Hero Illustration */}
              <AuthHero
                imageSrc="/authen/register-hero.svg"
                imageAlt="Register illustration"
                className="w-full lg:w-[45%] order-2 lg:order-1"
              />

              {/* Right Column - Register Form */}
              <div className="w-full lg:w-[55%] flex flex-col items-center lg:items-start order-1 lg:order-2">
                <div className="w-full max-w-[640px] space-y-8">
                  {/* Header */}
                  <div className="space-y-4">
                    <h1 className="text-4xl font-semibold text-foreground">
                      {t("title")}
                    </h1>
                    <p className="text-base text-muted-foreground">
                      {t("subtitle")}
                    </p>
                  </div>

                  {/* Register Form - uses hooks internally */}
                  <RegisterForm />

                  {/* Social Login - uses hooks internally */}
                  <SocialLoginButtons mode="register" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthRedirect>
  )
}
