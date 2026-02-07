"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface FloatingLabelInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: boolean
  containerClassName?: string
}

const FloatingLabelInput = React.forwardRef<
  HTMLInputElement,
  FloatingLabelInputProps
>(({ label, error, className, containerClassName, id, ...props }, ref) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-")

  return (
    <div className={cn("relative", containerClassName)}>
      <Input
        ref={ref}
        id={inputId}
        placeholder=" "
        className={cn(
          "h-14 pt-6 pb-2 px-4 peer",
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
    </div>
  )
})

FloatingLabelInput.displayName = "FloatingLabelInput"

export { FloatingLabelInput }
