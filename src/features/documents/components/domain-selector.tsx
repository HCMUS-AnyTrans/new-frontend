"use client"

import { useTranslations } from "next-intl"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { domains } from "../data"

interface DomainSelectorProps {
  value: string
  onChange: (domain: string) => void
}

export function DomainSelector({ value, onChange }: DomainSelectorProps) {
  const t = useTranslations("documents")

  return (
    <div>
      <Label className="mb-2 block">{t("configure.domainLabel")}</Label>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {domains.map((domain) => (
          <button
            key={domain.id}
            type="button"
            onClick={() => onChange(domain.id)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg border p-2 text-center transition-all",
              value === domain.id
                ? "border-primary bg-primary/5 text-primary"
                : "border-border bg-card text-foreground hover:bg-muted/50"
            )}
          >
            <span className="text-lg">{domain.icon}</span>
            <span className="text-xs font-medium">{t(`domains.${domain.id}`)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
