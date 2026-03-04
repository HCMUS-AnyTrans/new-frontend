"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LanguageSelector } from "./language-selector"
import { DomainSelector } from "./domain-selector"
import { ToneSelector } from "./tone-selector"
import { GlossarySection } from "./glossary-section"
import type { TranslationConfig, LanguageCode } from "../types"
import type { Glossary, Term } from "@/features/glossary"
import type { CreditEstimateResponse } from "../types"

interface StepConfigureProps {
  config: TranslationConfig
  onConfigChange: (updates: Partial<TranslationConfig>) => void
  glossaries: Glossary[]
  selectedGlossaryTerms: Term[]
  isLoadingGlossaries: boolean
  isLoadingGlossaryTerms: boolean
  estimate: CreditEstimateResponse | undefined
  isEstimating: boolean
  estimateError: string | null
  onBack: () => void
  onStart: () => void
  isLoading?: boolean
}

export function StepConfigure({
  config,
  onConfigChange,
  glossaries,
  selectedGlossaryTerms,
  isLoadingGlossaries,
  isLoadingGlossaryTerms,
  estimate,
  isEstimating,
  estimateError,
  onBack,
  onStart,
  isLoading,
}: StepConfigureProps) {
  const t = useTranslations("documents.configure")
  const isSameLang = config.srcLang !== "auto" && config.srcLang === config.tgtLang

  // Manual terms handlers
  const addManualTerm = () => {
    if (config.manualTerms.length >= 20) return
    onConfigChange({
      manualTerms: [...config.manualTerms, { id: `term-${Date.now()}`, src: "", tgt: "" }],
    })
  }

  const updateManualTerm = (id: string, field: "src" | "tgt", value: string) => {
    onConfigChange({
      manualTerms: config.manualTerms.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    })
  }

  const removeManualTerm = (id: string) => {
    onConfigChange({
      manualTerms: config.manualTerms.filter((t) => t.id !== id),
    })
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h2 className="text-2xl font-bold text-foreground">{t("title")}</h2>

      {/* Language Selector */}
      <LanguageSelector
        srcLang={config.srcLang}
        tgtLang={config.tgtLang}
        onSrcLangChange={(lang: LanguageCode) => onConfigChange({ srcLang: lang })}
        onTgtLangChange={(lang: LanguageCode) => onConfigChange({ tgtLang: lang })}
      />

      {/* Domain & Tone Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("domainAndTone")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <DomainSelector
            value={config.domain}
            onChange={(domain) => onConfigChange({ domain })}
          />
          <ToneSelector value={config.tone} onChange={(tone) => onConfigChange({ tone })} />
        </CardContent>
      </Card>

      {/* Glossary Section — manual inline terms only */}
      <GlossarySection
        glossaries={glossaries}
        selectedGlossaryId={config.selectedGlossaryId}
        selectedGlossaryTermCount={selectedGlossaryTerms.length}
        isLoadingGlossaries={isLoadingGlossaries}
        isLoadingGlossaryTerms={isLoadingGlossaryTerms}
        onSelectGlossary={(id) => onConfigChange({ selectedGlossaryId: id })}
        manualTerms={config.manualTerms}
        onAddManualTerm={addManualTerm}
        onUpdateManualTerm={updateManualTerm}
        onRemoveManualTerm={removeManualTerm}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("estimate.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isEstimating ? (
            <p className="text-sm text-muted-foreground">{t("estimate.loading")}</p>
          ) : null}

          {!isEstimating && estimate ? (
            <>
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-sm text-muted-foreground">{t("estimate.total")}</p>
                <p className="text-xl font-semibold text-foreground">
                  {estimate.totalCredits.toLocaleString()} {t("estimate.credits")}
                </p>
              </div>
              <div className="space-y-2">
                {estimate.breakdown.map((item) => (
                  <div
                    key={item.code}
                    className="flex items-center justify-between text-sm text-muted-foreground"
                  >
                    <span>{item.name}</span>
                    <span className="font-medium text-foreground">
                      {item.credits.toLocaleString()} {t("estimate.credits")}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{t("estimate.note")}</p>
            </>
          ) : null}

          {!isEstimating && !estimate && estimateError ? (
            <p className="text-sm text-destructive">{estimateError}</p>
          ) : null}
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button variant="outline" onClick={onBack}>
          {t("back")}
        </Button>
        <Button onClick={onStart} disabled={isSameLang || isLoading}>
          {isLoading ? t("processing") : t("startTranslation")}
        </Button>
      </div>
    </div>
  )
}
