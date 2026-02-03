"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { RegisterForm, SocialLoginButtons, AuthHero } from "@/components/auth"
import type { RegisterFormValues } from "@/data/auth"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleRegister(data: RegisterFormValues) {
    setIsLoading(true)

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("Register data:", data)

      // TODO: Handle successful registration
      // - Auto-login user
      // - Redirect to dashboard/verification page
      // router.push('/verify-email')

      // For now, show success and redirect to login
      alert("Đăng ký thành công! (Demo mode)")
      router.push("/login")
    } catch (error) {
      console.error("Register error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSocialLogin(provider: string) {
    setIsLoading(true)

    try {
      // TODO: Implement OAuth flow
      console.log(`Social register with: ${provider}`)

      // Simulate OAuth redirect
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert(`${provider} đăng ký sẽ được triển khai sau (Demo mode)`)
    } catch (error) {
      console.error("Social login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
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
              imageSrc="/authen/register-banner.png"
              imageAlt="Register illustration"
              className="w-full lg:w-[45%] order-2 lg:order-1"
            />

            {/* Right Column - Register Form */}
            <div className="w-full lg:w-[55%] flex flex-col items-center lg:items-start order-1 lg:order-2">
              <div className="w-full max-w-[640px] space-y-8">
                {/* Header */}
                <div className="space-y-4">
                  <h1 className="text-4xl font-semibold text-foreground">
                    Sign up
                  </h1>
                  <p className="text-base text-muted-foreground">
                    Let&apos;s get you all set up so you can access your
                    personal account.
                  </p>
                </div>

                {/* Register Form */}
                <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />

                {/* Social Login */}
                <SocialLoginButtons
                  onSocialLogin={handleSocialLogin}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
