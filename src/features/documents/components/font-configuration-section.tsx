"use client"

import { useTranslations } from "next-intl"
import { CardTitle } from "@/components/ui/card"
import { AppCard, AppCardHeader } from "@/components/ui/app-card"
import { Switch } from "@/components/ui/switch"
import { extractTargetFonts } from "../utils/font-target-slots"
import type { FontCheckItem, FontEnabledMap, FontSelectionMap, LanguageCode, ParsedFontsByGroup } from "../types"
import { FontMappingRow } from "./font-mapping-row"

interface FontConfigurationSectionProps {
  fontsUsedByGroup: ParsedFontsByGroup
  tgtLang: LanguageCode
  fontCheckItems: FontCheckItem[]
  keepOriginalFontSize: boolean
  fontConfigEnabled: boolean
  fontEnabledMap: FontEnabledMap
  fontSelections: FontSelectionMap
  fontParseSupported: boolean | null
  fontFlowUnavailable: boolean
  fontCheckUnavailable: boolean
  isCheckingFonts: boolean
  onKeepOriginalFontSizeChange: (enabled: boolean) => void
  onConfigEnabledChange: (enabled: boolean) => void
  onFontEnabledChange: (fromFont: string, enabled: boolean) => void
  onSelectionChange: (fromFont: string, toFont: string) => void
}

export function FontConfigurationSection({
  fontsUsedByGroup,
  tgtLang,
  fontCheckItems,
  keepOriginalFontSize,
  fontConfigEnabled,
  fontEnabledMap,
  fontSelections,
  fontParseSupported,
  fontFlowUnavailable,
  fontCheckUnavailable,
  isCheckingFonts,
  onKeepOriginalFontSizeChange,
  onConfigEnabledChange,
  onFontEnabledChange,
  onSelectionChange,
}: FontConfigurationSectionProps) {
  const t = useTranslations("documents.configure.fonts")
  const mergedFonts = extractTargetFonts(fontsUsedByGroup, tgtLang)
  const itemMap = new Map(fontCheckItems.map((item) => [item.from_font, item]))
  const hasFontOptions = fontParseSupported === true && !fontFlowUnavailable && mergedFonts.length > 0

  return (
    <AppCard>
      <AppCardHeader className="pb-3">
        <div className="space-y-1">
          <CardTitle className="text-base">{t("title")}</CardTitle>
        </div>
      </AppCardHeader>
      <div className="space-y-4 px-6 pb-6">
        {fontFlowUnavailable ? (
          <div className="rounded-lg border border-dashed bg-muted/20 p-4 text-sm text-muted-foreground">
            {t("metadataUnavailable")}
          </div>
        ) : null}

        {fontParseSupported === false ? (
          <div className="rounded-lg border border-dashed bg-muted/20 p-4 text-sm text-muted-foreground">
            {t("parsingUnsupported")}
          </div>
        ) : null}

        {fontParseSupported !== false && !fontFlowUnavailable && mergedFonts.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-muted/20 p-4 text-sm text-muted-foreground">
            {t("empty")}
          </div>
        ) : null}

        {fontCheckUnavailable ? (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-700">
            {t("checkUnavailable")}
          </div>
        ) : null}

        <div className="flex items-start justify-between gap-4 rounded-xl border bg-background/70 px-4 py-3">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">{t("fontSizeToggleTitle")}</p>
            <p className="text-xs text-muted-foreground">{t("fontSizeToggleDescription")}</p>
          </div>
          <Switch checked={keepOriginalFontSize} onCheckedChange={onKeepOriginalFontSizeChange} />
        </div>

        {isCheckingFonts ? (
          <div className="rounded-lg border bg-muted/20 p-4 text-sm text-muted-foreground">
            {t("checking")}
          </div>
        ) : null}

        {!isCheckingFonts && hasFontOptions ? (
          <div>
            <section className="overflow-hidden rounded-xl border bg-background/70">
              <div className="flex items-start justify-between gap-4 px-4 py-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">{t("globalToggle")}</p>
                  <p className="text-xs text-muted-foreground">
                    {fontConfigEnabled ? t("expandedHint") : t("collapsedHint")}
                  </p>
                </div>
                <div className="flex items-center">
                  <Switch checked={fontConfigEnabled} onCheckedChange={onConfigEnabledChange} />
                </div>
              </div>

              {fontConfigEnabled ? (
                <div className="space-y-3 border-t bg-muted/10 p-3 sm:p-4">
                  {mergedFonts.map((font) => {
                    const item = itemMap.get(font)

                    if (!item) {
                      return (
                        <div key={font} className="rounded-lg border bg-background p-3 text-sm text-muted-foreground">
                          {font}
                        </div>
                      )
                    }

                    return (
                      <FontMappingRow
                        key={font}
                        item={item}
                        enabled={fontEnabledMap[item.from_font] ?? true}
                        value={fontSelections[item.from_font] ?? item.to_font}
                        replacementLabel={t("replacementLabel")}
                        enabledLabel={t("fontToggle")}
                        supportedLabel={t("supported")}
                        unsupportedLabel={t("unsupported")}
                        supportedLockedLabel={t("supportedLocked")}
                        suggestedLabel={t("suggested")}
                        toggleOnLabel={t("toggleOn")}
                        toggleOffLabel={t("toggleOff")}
                        searchPlaceholder={t("searchPlaceholder")}
                        noSearchResultsLabel={t("noSearchResults")}
                        noCandidatesLabel={t("noCandidates")}
                        onToggle={(enabled) => onFontEnabledChange(item.from_font, enabled)}
                        onChange={(value) => onSelectionChange(item.from_font, value)}
                      />
                    )
                  })}
                </div>
              ) : null}
            </section>
          </div>
        ) : null}
      </div>
    </AppCard>
  )
}
