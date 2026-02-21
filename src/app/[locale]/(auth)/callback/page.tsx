"use client"

import { useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuthStore } from "@/features/auth"

function CallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { setAuth, clearAuth } = useAuthStore()

  useEffect(() => {
    const handleCallback = async () => {
      const accessToken = searchParams.get("accessToken")
      const error = searchParams.get("error")

      if (error) {
        // OAuth failed, redirect to login with error
        router.replace(`/login?error=${encodeURIComponent(error)}`)
        return
      }

      if (!accessToken) {
        // No token, redirect to login
        router.replace("/login?error=No access token received")
        return
      }

      try {
        // Fetch user info using the access token
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error("Failed to fetch user info")
        }

        const user = await response.json()

        // Set auth state
        setAuth(user, accessToken)

        // Always redirect to dashboard after OAuth login
        router.replace('/dashboard')
      } catch (error) {
        console.error("OAuth callback error:", error)
        clearAuth()
        router.replace("/login?error=Authentication failed")
      }
    }

    handleCallback()
  }, [searchParams, router, setAuth, clearAuth])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  )
}
