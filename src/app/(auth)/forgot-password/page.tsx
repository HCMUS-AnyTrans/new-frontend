"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import {
  ForgotPasswordForm,
  SocialLoginButtons,
  AuthHero,
} from "@/components/auth"
import type { ForgotPasswordFormValues } from "@/data/auth"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleForgotPassword(data: ForgotPasswordFormValues) {
    setIsLoading(true)

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/forgot-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("Forgot password data:", data)

      // TODO: Handle successful submission
      // - Show success message
      // - Optionally redirect to login or show success state
      // The form component will handle success state display
    } catch (error) {
      console.error("Forgot password error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSocialLogin(provider: string) {
    setIsLoading(true)

    try {
      // TODO: Implement OAuth flow
      console.log(`Social login with: ${provider}`)

      // Simulate OAuth redirect
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert(`${provider} login sẽ được triển khai sau (Demo mode)`)
    } catch (error) {
      console.error("Social login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

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
                  Back to login
                </Link>

                {/* Header */}
                <div className="space-y-4">
                  <h1 className="text-4xl font-semibold text-foreground">
                    Forgot your password?
                  </h1>
                  <p className="text-base text-muted-foreground">
                    Don&apos;t worry, happens to all of us. Enter your email
                    below to recover your password
                  </p>
                </div>

                {/* Forgot Password Form */}
                <ForgotPasswordForm
                  onSubmit={handleForgotPassword}
                  isLoading={isLoading}
                />

                {/* Social Login */}
                <SocialLoginButtons
                  onSocialLogin={handleSocialLogin}
                  isLoading={isLoading}
                />
              </div>
            </div>

            {/* Right Column - Hero Illustration */}
            <AuthHero
              imageSrc="/authen/banner-authen-01.png"
              imageAlt="Forgot password illustration"
              className="w-full lg:w-1/2"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
