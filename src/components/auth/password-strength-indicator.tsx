"use client"

import { useMemo } from "react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Check, X } from "lucide-react"

interface PasswordRequirement {
  key: string
  regex: RegExp
  met: boolean
}

interface PasswordStrengthIndicatorProps {
  password: string
  className?: string
  showRequirements?: boolean
}

/**
 * Password strength requirements matching backend @IsStrongPassword()
 */
const getPasswordRequirements = (password: string): PasswordRequirement[] => [
  {
    key: "minLength",
    regex: /.{8,}/,
    met: /.{8,}/.test(password),
  },
  {
    key: "lowercase",
    regex: /[a-z]/,
    met: /[a-z]/.test(password),
  },
  {
    key: "uppercase",
    regex: /[A-Z]/,
    met: /[A-Z]/.test(password),
  },
  {
    key: "number",
    regex: /[0-9]/,
    met: /[0-9]/.test(password),
  },
  {
    key: "special",
    regex: /[^a-zA-Z0-9]/,
    met: /[^a-zA-Z0-9]/.test(password),
  },
]

type StrengthLevel = "empty" | "weak" | "fair" | "good" | "strong"

const getStrengthLevel = (metCount: number, total: number): StrengthLevel => {
  if (metCount === 0) return "empty"
  const percentage = metCount / total
  if (percentage <= 0.25) return "weak"
  if (percentage <= 0.5) return "fair"
  if (percentage <= 0.75) return "good"
  return "strong"
}

const strengthColors: Record<StrengthLevel, string> = {
  empty: "bg-muted",
  weak: "bg-destructive",
  fair: "bg-orange-500",
  good: "bg-yellow-500",
  strong: "bg-green-500",
}

export function PasswordStrengthIndicator({
  password,
  className,
  showRequirements = true,
}: PasswordStrengthIndicatorProps) {
  const t = useTranslations("auth.passwordStrength")

  const requirements = useMemo(
    () => getPasswordRequirements(password),
    [password]
  )

  const metCount = requirements.filter((r) => r.met).length
  const strengthLevel = getStrengthLevel(metCount, requirements.length)
  const strengthColor = strengthColors[strengthLevel]
  const strengthLabel = strengthLevel !== "empty" ? t(strengthLevel) : ""

  if (!password) {
    return null
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Strength Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">{t("label")}</span>
          {strengthLabel && (
            <span
              className={cn(
                "text-xs font-medium",
                strengthLevel === "weak" && "text-destructive",
                strengthLevel === "fair" && "text-orange-500",
                strengthLevel === "good" && "text-yellow-600",
                strengthLevel === "strong" && "text-green-600"
              )}
            >
              {strengthLabel}
            </span>
          )}
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-200",
                index < metCount ? strengthColor : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      {/* Requirements List */}
      {showRequirements && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {requirements.map((requirement) => (
            <li
              key={requirement.key}
              className={cn(
                "flex items-center gap-1.5 text-xs transition-colors duration-200",
                requirement.met ? "text-green-600" : "text-muted-foreground"
              )}
            >
              {requirement.met ? (
                <Check className="h-3.5 w-3.5 shrink-0" />
              ) : (
                <X className="h-3.5 w-3.5 shrink-0" />
              )}
              <span>{t(`requirements.${requirement.key}`)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
