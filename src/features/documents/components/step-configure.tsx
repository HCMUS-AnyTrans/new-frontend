"use client"

import { AppCard, AppCardContent } from "@/components/ui/app-card"
import { LanguageSelector } from "./language-selector"
import { DomainSelector } from "./domain-selector"
import { ToneSelector } from "./tone-selector"
import { GlossarySection } from "./glossary-section"
import { FontConfigurationSection } from "./font-configuration-section"
import { ConfigureEstimateCard } from "./configure-estimate-card"
import { ConfigureEstimateSummary } from "./configure-estimate-summary"
import { ConfigureActionsPanel } from "./configure-actions-panel"
import { ConfigureMobileActionBar } from "./configure-mobile-action-bar"
import { useManualTerms } from "../hooks/use-manual-terms"
import { useStepConfigureState } from "../hooks/use-step-configure-state"
import type { TranslationConfig, LanguageCode, ParsedFontsByGroup, FontCheckItem, FontEnabledMap } from "../types"
import type { Glossary, Term } from "@/features/glossary"
import type { CreditEstimateResponse } from "../types"

interface StepConfigureProps {
  config: TranslationConfig
  onConfigChange: (updates: Partial<TranslationConfig>) => void
  glossaries: Glossary[]
  selectedGlossaryTerms: Term[]
  isLoadingGlossaries: boolean
  estimate: CreditEstimateResponse | undefined
  isEstimating: boolean
  estimateError: string | null
  currentBalance?: number
  isLoadingBalance?: boolean
  fontsUsedByGroup: ParsedFontsByGroup
  fontCheckItems: FontCheckItem[]
  keepOriginalFontSize: boolean
  fontConfigEnabled: boolean
  fontEnabledMap: FontEnabledMap
  fontParseSupported: boolean | null
  fontFlowUnavailable: boolean
  fontCheckUnavailable: boolean
  isCheckingFonts: boolean
  onKeepOriginalFontSizeChange: (enabled: boolean) => void
  onFontConfigEnabledChange: (enabled: boolean) => void
  onFontEnabledChange: (fromFont: string, enabled: boolean) => void
  onFontSelectionChange: (fromFont: string, toFont: string) => void
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
  estimate,
  isEstimating,
  estimateError,
  currentBalance,
  isLoadingBalance,
  fontsUsedByGroup,
  fontCheckItems,
  keepOriginalFontSize,
  fontConfigEnabled,
  fontEnabledMap,
  fontParseSupported,
  fontFlowUnavailable,
  fontCheckUnavailable,
  isCheckingFonts,
  onKeepOriginalFontSizeChange,
  onFontConfigEnabledChange,
  onFontEnabledChange,
  onFontSelectionChange,
  onBack,
  onStart,
  isLoading,
}: StepConfigureProps) {
  const { isInsufficientCredits, missingCredits, isStartDisabled } = useStepConfigureState({
    srcLang: config.srcLang,
    tgtLang: config.tgtLang,
    estimate,
    isEstimating,
    currentBalance,
    fontsUsedByGroup,
    fontParseSupported,
    isCheckingFonts,
    isLoading,
  })
  const { addManualTerm, updateManualTerm, removeManualTerm } = useManualTerms({
    manualTerms: config.manualTerms,
    onConfigChange,
  })
  const handleSourceLanguageChange = (lang: LanguageCode) => onConfigChange({ srcLang: lang })
  const handleTargetLanguageChange = (lang: LanguageCode) => onConfigChange({ tgtLang: lang })
  const handleDomainChange = (domain: string) => onConfigChange({ domain })
  const handleToneChange = (tone: string) => onConfigChange({ tone })
  const handleGlossarySelect = (id: string | null) => onConfigChange({ selectedGlossaryId: id })

  return (
    <div className="mx-auto max-w-6xl space-y-5 pb-24 xl:pb-0">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* Left: config sections */}
        <div className="space-y-4">
          <LanguageSelector
            srcLang={config.srcLang}
            tgtLang={config.tgtLang}
            onSrcLangChange={handleSourceLanguageChange}
            onTgtLangChange={handleTargetLanguageChange}
          />

          <AppCard>
            <AppCardContent className="space-y-6 pt-6">
              <DomainSelector value={config.domain} onChange={handleDomainChange} />
              <ToneSelector value={config.tone} onChange={handleToneChange} />
            </AppCardContent>
          </AppCard>

          <FontConfigurationSection
            fontsUsedByGroup={fontsUsedByGroup}
            tgtLang={config.tgtLang}
            fontCheckItems={fontCheckItems}
            keepOriginalFontSize={keepOriginalFontSize}
            fontConfigEnabled={fontConfigEnabled}
            fontEnabledMap={fontEnabledMap}
            fontSelections={config.fontSelections}
            fontParseSupported={fontParseSupported}
            fontFlowUnavailable={fontFlowUnavailable}
            fontCheckUnavailable={fontCheckUnavailable}
            isCheckingFonts={isCheckingFonts}
            onKeepOriginalFontSizeChange={onKeepOriginalFontSizeChange}
            onConfigEnabledChange={onFontConfigEnabledChange}
            onFontEnabledChange={onFontEnabledChange}
            onSelectionChange={onFontSelectionChange}
          />

          <GlossarySection
            glossaries={glossaries}
            selectedGlossaryId={config.selectedGlossaryId}
            selectedGlossaryTermCount={selectedGlossaryTerms.length}
            isLoadingGlossaries={isLoadingGlossaries}
            onSelectGlossary={handleGlossarySelect}
            manualTerms={config.manualTerms}
            onAddManualTerm={addManualTerm}
            onUpdateManualTerm={updateManualTerm}
            onRemoveManualTerm={removeManualTerm}
          />
        </div>

        {/* Right: estimate + actions (sticky on xl, shown inline below config on mobile) */}
        <div className="hidden space-y-4 xl:block xl:sticky xl:top-4 xl:self-start">
          <ConfigureEstimateCard
            isEstimating={isEstimating}
            estimate={estimate}
            estimateError={estimateError}
            isInsufficientCredits={isInsufficientCredits}
            missingCredits={missingCredits}
            currentBalance={currentBalance}
            isLoadingBalance={isLoadingBalance}
          />
          <ConfigureActionsPanel
            onBack={onBack}
            onStart={onStart}
            isLoading={isLoading}
            isStartDisabled={isStartDisabled}
            isInsufficientCredits={isInsufficientCredits}
          />
        </div>
      </div>

      {/* ── Mobile/tablet: estimate summary inline ── */}
      {!isEstimating && estimate && (
        <ConfigureEstimateSummary
          estimate={estimate}
          isInsufficientCredits={isInsufficientCredits}
          missingCredits={missingCredits}
        />
      )}

      {/* ── Mobile sticky action bar ── */}
      <ConfigureMobileActionBar
        onBack={onBack}
        onStart={onStart}
        isLoading={isLoading}
        isStartDisabled={isStartDisabled}
        isInsufficientCredits={isInsufficientCredits}
      />
    </div>
  )
}
