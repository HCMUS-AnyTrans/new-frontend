"use client"

import { useTranslations } from "next-intl"
import { CardDescription, CardTitle } from "@/components/ui/card"
import { AppCard, AppCardContent, AppCardHeader } from "@/components/ui/app-card"
import type { FontCheckItem, FontSelectionMap, ParsedFontsByGroup } from "../types"
import { FontMappingRow } from "./font-mapping-row"

interface FontConfigurationSectionProps {
  fontsUsedByGroup: ParsedFontsByGroup
  fontCheckItems: FontCheckItem[]
  fontSelections: FontSelectionMap
  fontParseSupported: boolean | null
  fontFlowUnavailable: boolean
  fontCheckUnavailable: boolean
  isCheckingFonts: boolean
  onSelectionChange: (fromFont: string, toFont: string) => void
}

const GROUP_LABELS: Record<string, string> = {
  ascii: "ASCII",
  hAnsi: "HAnsi",
  eastAsia: "East Asia",
  cs: "Complex Script",
  latin: "Latin",
  ea: "East Asia",
}

export function FontConfigurationSection({
  fontsUsedByGroup,
  fontCheckItems,
  fontSelections,
  fontParseSupported,
  fontFlowUnavailable,
  fontCheckUnavailable,
  isCheckingFonts,
  onSelectionChange,
}: FontConfigurationSectionProps) {
  const t = useTranslations("documents.configure.fonts")
  const groups = Object.entries(fontsUsedByGroup)
  const itemMap = new Map(fontCheckItems.map((item) => [item.from_font, item]))

  return (
    <AppCard>
      <AppCardHeader className="pb-3">
        <CardTitle className="text-base">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </AppCardHeader>
      <AppCardContent className="space-y-4">
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

        {fontParseSupported !== false && !fontFlowUnavailable && groups.length === 0 ? (
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

        {!isCheckingFonts && fontParseSupported === true && !fontFlowUnavailable && groups.length > 0 ? (
          <div className="space-y-4">
            {groups.map(([group, fonts]) => (
              <section key={group} className="space-y-3 rounded-xl border bg-muted/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{GROUP_LABELS[group] ?? group}</p>
                    <p className="text-xs text-muted-foreground">{t("groupCount", { count: fonts.length })}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {fonts.map((font) => {
                    const item = itemMap.get(font)

                    if (!item) {
                      return (
                        <div key={`${group}-${font}`} className="rounded-lg border bg-background p-3 text-sm text-muted-foreground">
                          {font}
                        </div>
                      )
                    }

                    return (
                      <FontMappingRow
                        key={`${group}-${font}`}
                        item={item}
                        value={fontSelections[item.from_font] ?? item.to_font}
                        groupLabel={GROUP_LABELS[group] ?? group}
                        replacementLabel={t("replacementLabel")}
                        supportedLabel={t("supported")}
                        unsupportedLabel={t("unsupported")}
                        suggestedLabel={t("suggested")}
                        noCandidatesLabel={t("noCandidates")}
                        onChange={(value) => onSelectionChange(item.from_font, value)}
                      />
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        ) : null}
      </AppCardContent>
    </AppCard>
  )
}
