"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { initiateGoogleAuth } from "../api"

export interface SocialLoginButtonsProps {
  /** Controls the divider text — "Or login with" vs "Or sign up with" */
  mode?: "login" | "register"
  onSocialLogin?: (provider: string) => void | Promise<void>
  isLoading?: boolean
  className?: string
}

export function SocialLoginButtons({
  mode = "login",
  onSocialLogin,
  isLoading,
  className,
}: SocialLoginButtonsProps) {
  const t = useTranslations("auth.social")

  const handleGoogleLogin = async () => {
    if (onSocialLogin) {
      await onSocialLogin("google")
    } else {
      initiateGoogleAuth()
    }
  }

  const dividerKey = mode === "register" ? "orSignUpWith" : "orLoginWith"

  return (
    <div className={cn("w-full max-w-[512px]", className)}>
      {/* Divider with Text */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 h-px bg-border opacity-50" />
        <span className="text-sm text-muted-foreground">{t(dividerKey)}</span>
        <div className="flex-1 h-px bg-border opacity-50" />
      </div>

      {/* Google Login Button */}
      <Button
        variant="outline"
        size="lg"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className={cn(
          "w-full h-14 border-primary hover:bg-primary/5",
          "transition-all duration-200",
          "flex items-center justify-center gap-3"
        )}
      >
        <Image
          src="/authen/google.svg"
          alt="Google icon"
          width={24}
          height={24}
          className="w-6 h-6"
        />
        <span className="text-sm font-medium">
          {t("continueWithGoogle")}
        </span>
      </Button>
    </div>
  )
}
