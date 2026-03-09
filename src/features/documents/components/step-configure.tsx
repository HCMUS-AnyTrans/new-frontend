"use client"

import { useTranslations } from "next-intl"
import { CardTitle } from "@/components/ui/card"
import { AppCard, AppCardContent, AppCardHeader } from "@/components/ui/app-card"
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
  currentBalance?: number
  isLoadingBalance?: boolean
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
  currentBalance,
  isLoadingBalance,
  onBack,
  onStart,
  isLoading,
}: StepConfigureProps) {
  const t = useTranslations("documents.configure")
  const isSameLang = config.srcLang === config.tgtLang
  const hasEstimate = !isEstimating && !!estimate
  const isEstimatePending = isEstimating || !estimate
  const isInsufficientCredits =
    hasEstimate && typeof currentBalance === "number" && currentBalance < estimate.totalCredits
  const missingCredits =
    isInsufficientCredits && typeof currentBalance === "number"
      ? estimate.totalCredits - currentBalance
      : 0

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
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <LanguageSelector
            srcLang={config.srcLang}
            tgtLang={config.tgtLang}
            onSrcLangChange={(lang: LanguageCode) => onConfigChange({ srcLang: lang })}
            onTgtLangChange={(lang: LanguageCode) => onConfigChange({ tgtLang: lang })}
          />

          <AppCard>
            <AppCardContent className="space-y-6 pt-6">
              <DomainSelector
                value={config.domain}
                onChange={(domain) => onConfigChange({ domain })}
              />
              <ToneSelector value={config.tone} onChange={(tone) => onConfigChange({ tone })} />
            </AppCardContent>
          </AppCard>

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
        </div>

        <div className="space-y-4 xl:sticky xl:top-4 xl:self-start">
          <AppCard>
            <AppCardHeader>
              <CardTitle className="text-base">{t("estimate.title")}</CardTitle>
            </AppCardHeader>
            <AppCardContent className="space-y-3">
              {isEstimating ? (
                <p className="text-sm text-muted-foreground">{t("estimate.loading")}</p>
              ) : null}

              {!isEstimating && estimate ? (
                <>
                  <div
                    className={
                      isInsufficientCredits
                        ? "rounded-lg border border-destructive/40 bg-destructive/5 p-3"
                        : "rounded-lg border bg-muted/30 p-3"
                    }
                  >
                    <p
                      className={
                        isInsufficientCredits ? "text-sm text-destructive" : "text-sm text-muted-foreground"
                      }
                    >
                      {t("estimate.total")}
                    </p>
                    <p
                      className={
                        isInsufficientCredits
                          ? "text-xl font-semibold text-destructive"
                          : "text-xl font-semibold text-foreground"
                      }
                    >
                      {estimate.totalCredits.toLocaleString()} {t("estimate.credits")}
                    </p>
                  </div>

                  <div className="space-y-1 rounded-lg border bg-muted/20 p-3">
                    <p className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{t("estimate.currentBalance")}</span>
                      <span className="font-medium text-foreground">
                        {isLoadingBalance
                          ? t("estimate.balanceLoading")
                          : typeof currentBalance === "number"
                            ? `${currentBalance.toLocaleString()} ${t("estimate.credits")}`
                            : "-"}
                      </span>
                    </p>
                    {isInsufficientCredits ? (
                      <p className="text-xs font-medium text-destructive">
                        {t("estimate.insufficientCredits", {
                          missing: missingCredits.toLocaleString(),
                        })}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    {estimate.breakdown.map((item) => (
                      <div
                        key={item.code}
                        className="flex items-center justify-between text-sm text-muted-foreground"
                      >
                        <span className="pr-2">{item.name}</span>
                        <span className="whitespace-nowrap font-medium text-foreground">
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
            </AppCardContent>
          </AppCard>

          <AppCard>
            <AppCardContent padding="all" className="space-y-3 p-4">
              <Button variant="outline" onClick={onBack} className="w-full">
                {t("back")}
              </Button>
                <Button
                  onClick={onStart}
                  disabled={isSameLang || isLoading || isEstimatePending || isInsufficientCredits}
                  className="w-full"
                >
                {isLoading ? t("processing") : t("startTranslation")}
              </Button>
              {isInsufficientCredits ? (
                <p className="text-xs text-destructive">{t("estimate.insufficientActionHint")}</p>
              ) : null}
            </AppCardContent>
          </AppCard>
        </div>
      </div>
    </div>
  )
}
