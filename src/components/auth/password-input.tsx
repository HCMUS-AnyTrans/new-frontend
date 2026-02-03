"use client"

import * as React from "react"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string
  error?: boolean
  containerClassName?: string
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, className, containerClassName, id, disabled, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-")

    return (
      <div className={cn("relative", containerClassName)}>
        <Input
          ref={ref}
          id={inputId}
          type={showPassword ? "text" : "password"}
          placeholder=" "
          disabled={disabled}
          className={cn(
            "h-14 pt-6 pb-2 px-4 pr-12 peer",
            "border-border focus-visible:border-primary",
            error && "border-destructive focus-visible:border-destructive",
            className
          )}
          aria-invalid={error}
          {...props}
        />
        <Label
          htmlFor={inputId}
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2",
            "text-muted-foreground pointer-events-none transition-all duration-200",
            "peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary",
            "peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs",
            error && "text-destructive peer-focus:text-destructive"
          )}
        >
          {label}
        </Label>
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={cn(
            "absolute right-4 top-1/2 -translate-y-1/2",
            "text-muted-foreground hover:text-foreground",
            "transition-colors p-1",
            disabled && "pointer-events-none opacity-50"
          )}
          disabled={disabled}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </button>
      </div>
    )
  }
)

PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
