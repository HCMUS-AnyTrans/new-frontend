"use client"

import { ArrowLeftRight, AlertCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { CardTitle } from "@/components/ui/card"
import { AppCard, AppCardContent, AppCardHeader } from "@/components/ui/app-card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { sourceLanguages, targetLanguages } from "../data"
import type { LanguageCode } from "../types"

interface LanguageSelectorProps {
  srcLang: LanguageCode
  tgtLang: LanguageCode
  onSrcLangChange: (lang: LanguageCode) => void
  onTgtLangChange: (lang: LanguageCode) => void
}

export function LanguageSelector({
  srcLang,
  tgtLang,
  onSrcLangChange,
  onTgtLangChange,
}: LanguageSelectorProps) {
  const t = useTranslations("documents")
  const isSameLang = srcLang !== "auto" && srcLang === tgtLang

  const swapLanguages = () => {
    if (srcLang === "auto") return
    onSrcLangChange(tgtLang)
    onTgtLangChange(srcLang)
  }

  return (
    <AppCard>
      <AppCardHeader className="pb-3">
        <CardTitle className="text-base">{t("configure.language")}</CardTitle>
      </AppCardHeader>
      <AppCardContent>
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-end">
          {/* Source language */}
          <div className="w-full">
            <Label htmlFor="src-lang" className="mb-2 block">
              {t("configure.from")}
            </Label>
            <Select value={srcLang} onValueChange={(v) => onSrcLangChange(v as LanguageCode)}>
              <SelectTrigger id="src-lang" className="w-full">
                <SelectValue placeholder={t("configure.sourcePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {sourceLanguages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {t(`languages.${lang.code}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Swap button */}
          <Button
            variant="outline"
            size="icon"
            onClick={swapLanguages}
            disabled={srcLang === "auto"}
            className="mx-auto shrink-0 md:mb-0.5"
          >
            <ArrowLeftRight className="size-4" />
          </Button>

          {/* Target language */}
          <div className="w-full">
            <Label htmlFor="tgt-lang" className="mb-2 block">
              {t("configure.to")}
            </Label>
            <Select value={tgtLang} onValueChange={(v) => onTgtLangChange(v as LanguageCode)}>
              <SelectTrigger id="tgt-lang" className="w-full">
                <SelectValue placeholder={t("configure.targetPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {targetLanguages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {t(`languages.${lang.code}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isSameLang && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/10 p-3 text-warning">
            <AlertCircle className="size-5 shrink-0" />
            <span className="text-sm font-medium">{t("configure.sameLangError")}</span>
          </div>
        )}
      </AppCardContent>
    </AppCard>
  )
}
