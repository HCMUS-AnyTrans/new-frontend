"use client"

import { Plus, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { CardTitle } from "@/components/ui/card"
import { AppCard, AppCardContent, AppCardHeader } from "@/components/ui/app-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { ManualTerm } from "../types"
import type { Glossary } from "@/features/glossary"

interface GlossarySectionProps {
  glossaries: Glossary[]
  selectedGlossaryId: string | null
  selectedGlossaryTermCount: number
  isLoadingGlossaries: boolean
  onSelectGlossary: (id: string | null) => void
  manualTerms: ManualTerm[]
  onAddManualTerm: () => void
  onUpdateManualTerm: (id: string, field: "src" | "tgt", value: string) => void
  onRemoveManualTerm: (id: string) => void
}

export function GlossarySection({
  glossaries,
  selectedGlossaryId,
  selectedGlossaryTermCount,
  isLoadingGlossaries,
  onSelectGlossary,
  manualTerms,
  onAddManualTerm,
  onUpdateManualTerm,
  onRemoveManualTerm,
}: GlossarySectionProps) {
  const t = useTranslations("documents.configure")
  const tGlossary = useTranslations("glossary")
  const validManualTerms = manualTerms.filter(
    (term) => term.src.trim().length > 0 && term.tgt.trim().length > 0
  ).length
  const totalAppliedTerms = selectedGlossaryTermCount + validManualTerms
  const isNearLimit = manualTerms.length >= 18

  return (
    <AppCard>
      <AppCardHeader className="pb-3">
        <CardTitle className="text-base">{t("glossary")}</CardTitle>
      </AppCardHeader>
      <AppCardContent className="space-y-4">
        <div className="rounded-lg border bg-background/70 p-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">{t("savedGlossaryLabel")}</Label>
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

            {isLoadingGlossaries ? (
              <p className="text-xs text-muted-foreground">{t("savedGlossaryLoading")}</p>
            ) : glossaries.length === 0 ? (
              <p className="text-xs text-muted-foreground">{t("savedGlossaryEmpty")}</p>
            ) : null}

          </div>
        </div>

        <div className="space-y-3 rounded-lg border bg-background/70 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{t("manualTermsTitle")}</p>
              <p className="text-xs text-muted-foreground">{t("manualTermsHelper")}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onAddManualTerm}
              disabled={manualTerms.length >= 20}
            >
              <Plus className="size-4" />
              {t("addTerm")} ({manualTerms.length}/20)
            </Button>
          </div>

          {manualTerms.length > 0 ? (
            <div className="hidden grid-cols-[minmax(0,1fr)_minmax(0,1fr)_40px] gap-3 px-1 text-xs font-medium text-muted-foreground sm:grid">
              <span>{t("sourceTerm")}</span>
              <span>{t("translatedTerm")}</span>
              <span className="text-right">{t("actions")}</span>
            </div>
          ) : null}

          {manualTerms.map((term) => (
            <div key={term.id} className="rounded-lg border bg-background p-2.5">
              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:gap-3">
                <Input
                  placeholder={t("sourceTerm")}
                  value={term.src}
                  onChange={(e) => onUpdateManualTerm(term.id, "src", e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder={t("translatedTerm")}
                  value={term.tgt}
                  onChange={(e) => onUpdateManualTerm(term.id, "tgt", e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveManualTerm(term.id)}
                  className="h-10 w-10 shrink-0 text-muted-foreground hover:text-destructive"
                  aria-label={t("removeTerm")}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              {(term.src.trim().length > 0 && term.tgt.trim().length === 0) ||
              (term.src.trim().length === 0 && term.tgt.trim().length > 0) ? (
                <p className="mt-2 text-xs text-warning">{t("termPairWarning")}</p>
              ) : null}
            </div>
          ))}

          {manualTerms.length === 0 && (
            <div className="rounded-lg border border-dashed bg-muted/20 p-5 text-center">
              <p className="text-sm font-medium text-foreground">{t("emptyManualTitle")}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t("emptyManualHint")}</p>
            </div>
          )}

          {isNearLimit ? <p className="text-xs text-warning">{t("nearLimitWarning")}</p> : null}
        </div>

        {totalAppliedTerms > 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-background/70 px-3 py-2.5">
            <span className="text-xs text-muted-foreground">{t("termsAppliedLabel")}</span>
            <span className="text-sm font-semibold text-foreground">
              {t("termsAppliedCount", { count: totalAppliedTerms })}
            </span>
          </div>
        ) : null}
      </AppCardContent>
    </AppCard>
  )
}
