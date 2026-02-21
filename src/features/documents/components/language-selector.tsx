"use client"

import { ArrowLeftRight, AlertCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("configure.language")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4 md:flex-row">
          {/* Source language */}
          <div className="w-full flex-1">
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
            className="mt-6 shrink-0"
          >
            <ArrowLeftRight className="size-4" />
          </Button>

          {/* Target language */}
          <div className="w-full flex-1">
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
      </CardContent>
    </Card>
  )
}
