"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { LoginForm, SocialLoginButtons, LoginHero } from "@/components/auth"
import type { LoginFormValues } from "@/data/auth"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogin(data: LoginFormValues) {
    setIsLoading(true)

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // })
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      console.log("Login data:", data)
      
      // TODO: Handle successful login
      // - Store auth token
      // - Redirect to dashboard/home
      // router.push('/dashboard')
      
      // For now, show success and redirect to home
      alert("Đăng nhập thành công! (Demo mode)")
      router.push("/")
    } catch (error) {
      console.error("Login error:", error)
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
          <span className="font-bold text-2xl text-primary">
            AnyTrans
          </span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left Column - Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start">
              <div className="w-full max-w-[512px] space-y-8">
                {/* Header */}
                <div className="space-y-4">
                  <h1 className="text-4xl font-semibold text-foreground">
                    Login
                  </h1>
                  <p className="text-base text-muted-foreground">
                    Login to access your travelwise account
                  </p>
                </div>

                {/* Login Form */}
                <LoginForm onSubmit={handleLogin} isLoading={isLoading} />

                {/* Social Login */}
                <SocialLoginButtons
                  onSocialLogin={handleSocialLogin}
                  isLoading={isLoading}
                />
              </div>
            </div>

            {/* Right Column - Hero Illustration */}
            <LoginHero className="w-full lg:w-1/2" />
          </div>
        </div>
      </div>
    </div>
  )
}
