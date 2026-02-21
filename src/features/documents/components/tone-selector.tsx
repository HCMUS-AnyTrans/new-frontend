"use client"

import { useTranslations } from "next-intl"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { tones } from "../data"

interface ToneSelectorProps {
  value: string
  onChange: (tone: string) => void
}

export function ToneSelector({ value, onChange }: ToneSelectorProps) {
  const t = useTranslations("documents")

  return (
    <div>
      <Label className="mb-2 block">{t("configure.toneLabel")}</Label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {tones.map((tone) => (
          <button
            key={tone.id}
            type="button"
            onClick={() => onChange(tone.id)}
            className={cn(
              "flex flex-col items-start rounded-lg border p-2.5 text-left transition-all",
              value === tone.id
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:bg-muted/50"
            )}
          >
            <span
              className={cn(
                "text-sm font-medium",
                value === tone.id ? "text-primary" : "text-foreground"
              )}
            >
              {t(`tones.${tone.id}`)}
            </span>
            <span className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
              {t(`toneDescriptions.${tone.id}`)}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
