"use client"

import * as React from "react"
import PhoneInputWithCountry from "react-phone-number-input"
import type { Country } from "react-phone-number-input"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

// Import the default styles - we'll override with custom CSS
import "react-phone-number-input/style.css"

export interface PhoneInputProps {
  value?: string
  onChange: (value: string | undefined) => void
  label?: string
  error?: boolean
  disabled?: boolean
  className?: string
  defaultCountry?: Country
  placeholder?: string
}

/**
 * Phone Input with Country Code Picker
 * 
 * Features:
 * - Dropdown with 200+ countries and flags
 * - Auto-format based on country
 * - Output in E.164 format (+84901234567)
 * - Floating label style matching other form inputs
 */
const PhoneInput = React.forwardRef<HTMLDivElement, PhoneInputProps>(
  (
    {
      value,
      onChange,
      label = "Phone Number",
      error,
      disabled,
      className,
      defaultCountry = "VN",
      placeholder = " ",
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const hasValue = !!value && value.length > 0

    // Label should be positioned after the country selector
    // Country selector is approximately 60px wide (flag + arrow + padding)
    const labelLeftPosition = "left-[72px]"

    return (
      <div
        ref={ref}
        className={cn(
          "phone-input-container relative",
          error && "phone-input-error",
          disabled && "phone-input-disabled",
          className
        )}
      >
        <PhoneInputWithCountry
          international
          countryCallingCodeEditable={false}
          defaultCountry={defaultCountry}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="phone-input-field"
        />
        <Label
          className={cn(
            "absolute pointer-events-none transition-all duration-200",
            labelLeftPosition,
            "text-muted-foreground",
            // Always float label — country code (+84) is always visible so
            // the resting position would overlap with it
            "top-1.5 text-xs",
            // Color states
            isFocused && !error && "text-primary",
            error && "text-destructive"
          )}
        >
          {label}
        </Label>
      </div>
    )
  }
)

PhoneInput.displayName = "PhoneInput"

export { PhoneInput }
