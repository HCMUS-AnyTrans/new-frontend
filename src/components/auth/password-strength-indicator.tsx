"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"
import { Check, X } from "lucide-react"

interface PasswordRequirement {
  label: string
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
    label: "Ít nhất 8 ký tự",
    regex: /.{8,}/,
    met: /.{8,}/.test(password),
  },
  {
    label: "Ít nhất 1 chữ thường",
    regex: /[a-z]/,
    met: /[a-z]/.test(password),
  },
  {
    label: "Ít nhất 1 chữ hoa",
    regex: /[A-Z]/,
    met: /[A-Z]/.test(password),
  },
  {
    label: "Ít nhất 1 số",
    regex: /[0-9]/,
    met: /[0-9]/.test(password),
  },
  {
    label: "Ít nhất 1 ký tự đặc biệt",
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

const strengthConfig: Record<
  StrengthLevel,
  { label: string; color: string; bgColor: string }
> = {
  empty: { label: "", color: "bg-muted", bgColor: "bg-muted" },
  weak: { label: "Yếu", color: "bg-destructive", bgColor: "bg-destructive/20" },
  fair: { label: "Trung bình", color: "bg-orange-500", bgColor: "bg-orange-500/20" },
  good: { label: "Tốt", color: "bg-yellow-500", bgColor: "bg-yellow-500/20" },
  strong: { label: "Mạnh", color: "bg-green-500", bgColor: "bg-green-500/20" },
}

export function PasswordStrengthIndicator({
  password,
  className,
  showRequirements = true,
}: PasswordStrengthIndicatorProps) {
  const requirements = useMemo(
    () => getPasswordRequirements(password),
    [password]
  )

  const metCount = requirements.filter((r) => r.met).length
  const strengthLevel = getStrengthLevel(metCount, requirements.length)
  const config = strengthConfig[strengthLevel]

  if (!password) {
    return null
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Strength Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Độ mạnh mật khẩu</span>
          {config.label && (
            <span
              className={cn(
                "text-xs font-medium",
                strengthLevel === "weak" && "text-destructive",
                strengthLevel === "fair" && "text-orange-500",
                strengthLevel === "good" && "text-yellow-600",
                strengthLevel === "strong" && "text-green-600"
              )}
            >
              {config.label}
            </span>
          )}
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-200",
                index < metCount ? config.color : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      {/* Requirements List */}
      {showRequirements && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {requirements.map((requirement, index) => (
            <li
              key={index}
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
              <span>{requirement.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
