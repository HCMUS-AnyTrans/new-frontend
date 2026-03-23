"use client"

import { Plus, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ManualTerm } from "../types"

interface ManualGlossaryTermsProps {
  manualTerms: ManualTerm[]
  onAddManualTerm: () => void
  onUpdateManualTerm: (id: string, field: "src" | "tgt", value: string) => void
  onRemoveManualTerm: (id: string) => void
}

export function ManualGlossaryTerms({
  manualTerms,
  onAddManualTerm,
  onUpdateManualTerm,
  onRemoveManualTerm,
}: ManualGlossaryTermsProps) {
  const t = useTranslations("documents.configure")
  const isNearLimit = manualTerms.length >= 18

  return (
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

      {manualTerms.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-muted/20 p-5 text-center">
          <p className="text-sm font-medium text-foreground">{t("emptyManualTitle")}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t("emptyManualHint")}</p>
        </div>
      ) : null}

      {isNearLimit ? <p className="text-xs text-warning">{t("nearLimitWarning")}</p> : null}
    </div>
  )
}
