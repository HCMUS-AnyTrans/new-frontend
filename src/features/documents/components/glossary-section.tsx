"use client"

import { useTranslations } from "next-intl"
import { CardTitle } from "@/components/ui/card"
import { AppCard, AppCardContent, AppCardHeader } from "@/components/ui/app-card"
import { Switch } from "@/components/ui/switch"
import { ManualGlossaryTerms } from "./manual-glossary-terms"
import { SavedGlossarySelector } from "./saved-glossary-selector"
import type { ManualTerm } from "../types"
import type { Glossary } from "@/features/glossary"

interface GlossarySectionProps {
  glossaries: Glossary[]
  domain: string
  selectedGlossaryId: string | null
  selectedGlossaryTermCount: number
  isLoadingGlossaries: boolean
  onSelectGlossary: (id: string | null) => void
  useSystemGlossary: boolean
  onUseSystemGlossaryChange: (enabled: boolean) => void
  manualTerms: ManualTerm[]
  onAddManualTerm: () => void
  onUpdateManualTerm: (id: string, field: "src" | "tgt", value: string) => void
  onRemoveManualTerm: (id: string) => void
}

export function GlossarySection({
  glossaries,
  domain,
  selectedGlossaryId,
  selectedGlossaryTermCount,
  isLoadingGlossaries,
  onSelectGlossary,
  useSystemGlossary,
  onUseSystemGlossaryChange,
  manualTerms,
  onAddManualTerm,
  onUpdateManualTerm,
  onRemoveManualTerm,
}: GlossarySectionProps) {
  const t = useTranslations("documents.configure")
  const validManualTerms = manualTerms.filter(
    (term) => term.src.trim().length > 0 && term.tgt.trim().length > 0
  ).length
  const totalAppliedTerms = selectedGlossaryTermCount + validManualTerms

  return (
    <AppCard>
      <AppCardHeader className="pb-3">
        <CardTitle className="text-base">{t("glossary")}</CardTitle>
      </AppCardHeader>
      <AppCardContent className="space-y-4">
        <SavedGlossarySelector
          glossaries={glossaries}
          selectedGlossaryId={selectedGlossaryId}
          isLoadingGlossaries={isLoadingGlossaries}
          onSelectGlossary={onSelectGlossary}
        />

        {domain !== "other" ? (
          <div className="flex items-start justify-between gap-4 rounded-xl border bg-background/70 px-4 py-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">{t("systemGlossaryTitle")}</p>
              <p className="text-xs text-muted-foreground">{t("systemGlossaryDescription")}</p>
            </div>
            <Switch checked={useSystemGlossary} onCheckedChange={onUseSystemGlossaryChange} />
          </div>
        ) : null}

        <ManualGlossaryTerms
          manualTerms={manualTerms}
          onAddManualTerm={onAddManualTerm}
          onUpdateManualTerm={onUpdateManualTerm}
          onRemoveManualTerm={onRemoveManualTerm}
        />

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
