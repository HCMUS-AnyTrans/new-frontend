"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { ResetPasswordForm, AuthHero } from "@/components/auth"
import type { ResetPasswordFormValues } from "@/data/auth"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  // Get token from URL query parameter
  useEffect(() => {
    const tokenParam = searchParams.get("token")
    if (tokenParam) {
      setToken(tokenParam)
    }
  }, [searchParams])

  async function handleResetPassword(data: ResetPasswordFormValues) {
    setIsLoading(true)

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     token: token || data.token,
      //     password: data.password,
      //     confirmPassword: data.confirmPassword,
      //   }),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("Reset password data:", {
        token: token || data.token,
        password: data.password,
      })

      // TODO: Handle successful password reset
      // - Show success message (handled by form component)
      // - Redirect to login page after delay
      // setTimeout(() => {
      //   router.push('/login')
      // }, 3000)
    } catch (error) {
      console.error("Reset password error:", error)
      throw error
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

                {/* Reset Password Form */}
                <ResetPasswordForm
                  onSubmit={handleResetPassword}
                  isLoading={isLoading}
                  token={token || undefined}
                />
              </div>
            </div>

            {/* Right Column - Hero Illustration */}
            <AuthHero
              imageSrc="/authen/banner-authen-01.png"
              imageAlt="Reset password illustration"
              className="w-full lg:w-1/2"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
