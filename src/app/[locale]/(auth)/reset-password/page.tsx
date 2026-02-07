"use client"

import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { ResetPasswordForm, AuthHero } from "@/features/auth"

function ResetPasswordContent() {
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
            {/* Left Column - Reset Password Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start">
              <div className="w-full max-w-[512px] space-y-8">
                {/* Header */}
                <div className="space-y-4">
                  <h1 className="text-4xl font-semibold text-foreground">
                    Set a password
                  </h1>
                  <p className="text-base text-muted-foreground">
                    Your previous password has been reseted. Please set a new
                    password for your account.
                  </p>
                </div>

                {/* Reset Password Form - handles token from URL internally */}
                <ResetPasswordForm />
              </div>
            </div>

            {/* Right Column - Hero Illustration */}
            <AuthHero
              imageSrc="/authen/reset-password-hero.svg"
              imageAlt="Reset password illustration"
              className="w-full lg:w-1/2"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPasswordContent />
    </Suspense>
  )
}
