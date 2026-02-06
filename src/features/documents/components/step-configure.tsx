"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LanguageSelector } from "./language-selector"
import { DomainSelector } from "./domain-selector"
import { ToneSelector } from "./tone-selector"
import { GlossarySection } from "./glossary-section"
import type { TranslationConfig, Glossary, LanguageCode } from "../types"

interface StepConfigureProps {
  config: TranslationConfig
  glossaries: Glossary[]
  onConfigChange: (updates: Partial<TranslationConfig>) => void
  onBack: () => void
  onStart: () => void
  isLoading?: boolean
}

export function StepConfigure({
  config,
  glossaries,
  onConfigChange,
  onBack,
  onStart,
  isLoading,
}: StepConfigureProps) {
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
      <h2 className="text-2xl font-bold text-foreground">Cấu hình dịch thuật</h2>

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
          <CardTitle className="text-base">Lĩnh vực & Giọng điệu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <DomainSelector
            value={config.domain}
            onChange={(domain) => onConfigChange({ domain })}
          />
          <ToneSelector value={config.tone} onChange={(tone) => onConfigChange({ tone })} />
        </CardContent>
      </Card>

      {/* Glossary Section */}
      <GlossarySection
        glossaries={glossaries}
        selectedGlossaryId={config.glossaryId}
        manualTerms={config.manualTerms}
        onGlossaryChange={(glossaryId) => onConfigChange({ glossaryId })}
        onAddManualTerm={addManualTerm}
        onUpdateManualTerm={updateManualTerm}
        onRemoveManualTerm={removeManualTerm}
      />

      {/* Action buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button variant="outline" onClick={onBack}>
          Quay lại
        </Button>
        <Button onClick={onStart} disabled={isSameLang || isLoading}>
          {isLoading ? "Đang xử lý..." : "Bắt đầu dịch"}
        </Button>
      </div>
    </div>
  )
}
