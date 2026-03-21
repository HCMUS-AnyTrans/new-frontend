"use client"

import { useTranslations } from "next-intl"
import { ChevronDown } from "lucide-react"
import { CardDescription, CardTitle } from "@/components/ui/card"
import { AppCard, AppCardHeader } from "@/components/ui/app-card"
import { Switch } from "@/components/ui/switch"
import type { FontCheckItem, FontEnabledMap, FontSelectionMap, ParsedFontsByGroup } from "../types"
import { FontMappingRow } from "./font-mapping-row"

function extractMergedFonts(fontsUsedByGroup: ParsedFontsByGroup): string[] {
  return [
    ...new Set(
      Object.values(fontsUsedByGroup)
        .flatMap((fonts) => fonts)
        .map((font) => font.trim())
        .filter((font) => font.length > 0)
    ),
  ]
}

interface FontConfigurationSectionProps {
  fontsUsedByGroup: ParsedFontsByGroup
  fontCheckItems: FontCheckItem[]
  fontConfigEnabled: boolean
  fontEnabledMap: FontEnabledMap
  fontSelections: FontSelectionMap
  fontParseSupported: boolean | null
  fontFlowUnavailable: boolean
  fontCheckUnavailable: boolean
  isCheckingFonts: boolean
  onConfigEnabledChange: (enabled: boolean) => void
  onFontEnabledChange: (fromFont: string, enabled: boolean) => void
  onSelectionChange: (fromFont: string, toFont: string) => void
}

export function FontConfigurationSection({
  fontsUsedByGroup,
  fontCheckItems,
  fontConfigEnabled,
  fontEnabledMap,
  fontSelections,
  fontParseSupported,
  fontFlowUnavailable,
  fontCheckUnavailable,
  isCheckingFonts,
  onConfigEnabledChange,
  onFontEnabledChange,
  onSelectionChange,
}: FontConfigurationSectionProps) {
  const t = useTranslations("documents.configure.fonts")
  const mergedFonts = extractMergedFonts(fontsUsedByGroup)
  const itemMap = new Map(fontCheckItems.map((item) => [item.from_font, item]))
  const hasFontOptions = fontParseSupported === true && !fontFlowUnavailable && mergedFonts.length > 0

  return (
    <AppCard>
      <AppCardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-base">{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>

          {hasFontOptions ? (
            <div className="flex items-center gap-3 rounded-full border bg-muted/20 px-3 py-1.5">
              <span className="text-xs font-medium text-muted-foreground">{t("globalToggle")}</span>
              <Switch checked={fontConfigEnabled} onCheckedChange={onConfigEnabledChange} />
            </div>
          ) : null}
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

        {isCheckingFonts ? (
          <div className="rounded-lg border bg-muted/20 p-4 text-sm text-muted-foreground">
            {t("checking")}
          </div>
        ) : null}

        {!isCheckingFonts && hasFontOptions ? (
          <div className="space-y-4">
            <section className="space-y-3 rounded-xl border bg-muted/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">{t("groupCount", { count: mergedFonts.length })}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{fontConfigEnabled ? t("expandedHint") : t("collapsedHint")}</p>
                </div>
                <ChevronDown className={`size-4 text-muted-foreground transition-transform ${fontConfigEnabled ? "rotate-180" : "rotate-0"}`} />
              </div>

              {fontConfigEnabled ? (
                <div className="space-y-3">
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
