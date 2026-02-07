"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { initiateGoogleAuth } from "../api"

export interface SocialLoginProvider {
  id: "facebook" | "google"
  name: string
  iconPath: string
  onClick?: () => void | Promise<void>
}

export interface SocialLoginButtonsProps {
  onSocialLogin?: (provider: string) => void | Promise<void>
  isLoading?: boolean
  className?: string
}

export function SocialLoginButtons({
  onSocialLogin,
  isLoading,
  className,
}: SocialLoginButtonsProps) {
  const t = useTranslations("auth.social")

  const handleSocialLogin = async (provider: string) => {
    if (onSocialLogin) {
      await onSocialLogin(provider)
    } else if (provider === "google") {
      // Use the Google OAuth from auth feature
      initiateGoogleAuth()
    } else {
      // Facebook login not yet implemented
      console.log(`Social login with: ${provider}`)
      alert(`${provider} login not yet implemented`)
    }
  }

  const providers: SocialLoginProvider[] = [
    {
      id: "facebook",
      name: "Facebook",
      iconPath: "/authen/facebook-icon.svg",
    },
    {
      id: "google",
      name: "Google",
      iconPath: "/authen/google.svg",
    },
  ]

  return (
    <div className={cn("w-full max-w-[512px]", className)}>
      {/* Divider with Text */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 h-px bg-border opacity-50" />
        <span className="text-sm text-muted-foreground">{t("orLoginWith")}</span>
        <div className="flex-1 h-px bg-border opacity-50" />
      </div>

      {/* Social Login Buttons */}
      <div className="grid grid-cols-2 gap-4">
        {providers.map((provider) => (
          <Button
            key={provider.id}
            variant="outline"
            size="lg"
            onClick={() => handleSocialLogin(provider.id)}
            disabled={isLoading}
            className={cn(
              "h-14 border-primary hover:bg-primary/5",
              "transition-all duration-200",
              "flex items-center justify-center"
            )}
          >
            <Image
              src={provider.iconPath}
              alt={`${provider.name} icon`}
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <span className="sr-only">{t("loginWith", { provider: provider.name })}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
