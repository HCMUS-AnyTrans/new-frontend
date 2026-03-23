"use client"

import { useTranslations } from "next-intl"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { Glossary } from "@/features/glossary"

interface SavedGlossarySelectorProps {
  glossaries: Glossary[]
  selectedGlossaryId: string | null
  isLoadingGlossaries: boolean
  onSelectGlossary: (id: string | null) => void
}

export function SavedGlossarySelector({
  glossaries,
  selectedGlossaryId,
  isLoadingGlossaries,
  onSelectGlossary,
}: SavedGlossarySelectorProps) {
  const t = useTranslations("documents.configure")
  const tGlossary = useTranslations("glossary")
  const hasSavedGlossaries = glossaries.length > 0

  return (
    <div className="rounded-lg border bg-background/70 p-4">
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">{t("savedGlossaryLabel")}</Label>
        {hasSavedGlossaries ? (
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <button
              type="button"
              onClick={() => onSelectGlossary(null)}
              disabled={isLoadingGlossaries}
              className={cn(
                "flex min-h-20 flex-col items-start justify-center rounded-lg border p-2.5 text-left text-sm transition-all",
                selectedGlossaryId === null
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card text-foreground hover:bg-muted/50",
                isLoadingGlossaries && "cursor-wait opacity-70"
              )}
            >
              <span
                className={cn(
                  "text-sm font-medium",
                  selectedGlossaryId === null ? "text-primary" : "text-foreground"
                )}
              >
                {t("savedGlossaryNone")}
              </span>
              <span className="mt-0.5 text-xs text-muted-foreground">{t("savedGlossaryLabel")}</span>
            </button>

            {glossaries.map((glossary) => {
              const isSelected = selectedGlossaryId === glossary.id

              return (
                <button
                  key={glossary.id}
                  type="button"
                  onClick={() => onSelectGlossary(glossary.id)}
                  disabled={isLoadingGlossaries}
                  className={cn(
                    "flex min-h-20 flex-col items-start rounded-lg border p-2.5 text-left text-sm transition-all",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card text-foreground hover:bg-muted/50",
                    isLoadingGlossaries && "cursor-wait opacity-70"
                  )}
                >
                  <span
                    className={cn(
                      "line-clamp-2 text-sm font-medium leading-5",
                      isSelected ? "text-primary" : "text-foreground"
                    )}
                  >
                    {glossary.name}
                  </span>
                  <span className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                    {tGlossary(`domains.${glossary.domain}`)}
                  </span>
                  <span className="mt-2 inline-flex rounded-full border border-border bg-background px-2 py-0.5 text-[11px] text-muted-foreground">
                    {tGlossary("termCount", { count: glossary.termCount })}
                  </span>
                </button>
              )
            })}
          </div>
        ) : null}

        {isLoadingGlossaries ? (
          <p className="text-xs text-muted-foreground">{t("savedGlossaryLoading")}</p>
        ) : glossaries.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-muted/20 p-5 text-center">
            <p className="text-sm text-muted-foreground">{t("savedGlossaryEmpty")}</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
