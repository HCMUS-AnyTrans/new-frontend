"use client"

import * as React from "react"
import { getCountryCallingCode } from "react-phone-number-input"
import type { Country } from "react-phone-number-input"
import { ChevronDown, Search, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"

// ---------------------------------------------------------------------------
// Types — matches what react-phone-number-input passes to countrySelectComponent
// ---------------------------------------------------------------------------

interface CountryOption {
  value?: string
  label: string
  divider?: boolean
}

interface CountrySelectProps {
  value?: string
  onChange: (value?: string) => void
  options: CountryOption[]
  disabled?: boolean
  readOnly?: boolean
  iconComponent: React.ElementType
  name?: string
  "aria-label"?: string
  onFocus?: (event: React.FocusEvent) => void
  onBlur?: (event: React.FocusEvent) => void
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getCallingCode(countryCode?: string): string {
  if (!countryCode) return ""
  try {
    return `+${getCountryCallingCode(countryCode as Country)}`
  } catch {
    return ""
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CountrySelect({
  value,
  onChange,
  options,
  disabled,
  readOnly,
  iconComponent: IconComponent,
  onFocus,
  onBlur,
  ...rest
}: CountrySelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const searchInputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)

  // Filter out dividers, then apply search
  const countryOptions = React.useMemo(
    () => options.filter((o) => !o.divider),
    [options]
  )

  const filteredOptions = React.useMemo(() => {
    if (!search.trim()) return countryOptions
    const lower = search.toLowerCase()
    return countryOptions.filter((o) => {
      if (o.label.toLowerCase().includes(lower)) return true
      // Also match by calling code (e.g. "84" or "+84")
      if (o.value) {
        try {
          const code = getCountryCallingCode(o.value as Country)
          if (code.includes(lower.replace("+", ""))) return true
        } catch {
          /* skip */
        }
      }
      return false
    })
  }, [countryOptions, search])

  const handleSelect = (countryValue?: string) => {
    onChange(countryValue)
    setOpen(false)
    setSearch("")
  }

  // Scroll the selected country into view when dropdown opens
  React.useEffect(() => {
    if (open && listRef.current && value) {
      requestAnimationFrame(() => {
        const el = listRef.current?.querySelector(
          `[data-country="${value}"]`
        )
        if (el) {
          el.scrollIntoView({ block: "center" })
        }
      })
    }
  }, [open, value])

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        if (disabled || readOnly) return
        setOpen(isOpen)
        if (!isOpen) setSearch("")
      }}
    >
      {/* ---- Trigger: flag + chevron ---- */}
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "country-select-trigger",
            "flex items-center gap-1 h-full pl-3 pr-2",
            "border-r border-input",
            "hover:bg-muted/50 transition-colors cursor-pointer",
            "focus-visible:outline-none",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          disabled={disabled || readOnly}
          aria-label={rest["aria-label"]}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          {IconComponent && value ? (
            <IconComponent country={value} label="" />
          ) : (
            <span className="w-6 h-4 flex items-center justify-center text-muted-foreground text-xs">
              🌐
            </span>
          )}
          <ChevronDown
            className={cn(
              "size-3 text-muted-foreground shrink-0 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>
      </PopoverTrigger>

      {/* ---- Dropdown: search + scrollable list ---- */}
      <PopoverContent
        className="w-[280px] p-0"
        align="start"
        sideOffset={4}
        onOpenAutoFocus={(e) => {
          e.preventDefault()
          searchInputRef.current?.focus()
        }}
      >
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
          <Search className="size-4 text-muted-foreground shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search countries..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* List */}
        <div
          ref={listRef}
          className="max-h-[280px] overflow-y-auto py-1 country-select-list"
        >
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              No countries found
            </div>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = option.value === value
              const callingCode = getCallingCode(option.value)
              return (
                <button
                  key={option.value || "_intl"}
                  type="button"
                  data-country={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "flex items-center gap-2.5 w-full px-3 py-2 text-left text-sm",
                    "hover:bg-muted transition-colors cursor-pointer",
                    isSelected && "bg-primary/5"
                  )}
                >
                  {/* Flag */}
                  {IconComponent && option.value ? (
                    <IconComponent
                      country={option.value}
                      label={option.label}
                    />
                  ) : (
                    <span className="w-6 h-4 flex items-center justify-center text-muted-foreground text-xs">
                      🌐
                    </span>
                  )}

                  {/* Country name */}
                  <span
                    className={cn(
                      "flex-1 truncate",
                      isSelected && "font-medium text-primary"
                    )}
                  >
                    {option.label}
                  </span>

                  {/* Calling code */}
                  {callingCode && (
                    <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                      {callingCode}
                    </span>
                  )}

                  {/* Check mark */}
                  {isSelected && (
                    <Check className="size-3.5 text-primary shrink-0" />
                  )}
                </button>
              )
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

CountrySelect.displayName = "CountrySelect"
