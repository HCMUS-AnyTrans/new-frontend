import type { LanguageCode, ParsedFontsByGroup } from "../types"

const EAST_ASIAN_LANGS = new Set(["zh", "ja", "ko"])
const COMPLEX_SCRIPT_LANGS = new Set([
  "ar",
  "fa",
  "ur",
  "he",
  "hi",
  "bn",
  "ta",
  "te",
  "ml",
  "kn",
  "gu",
  "pa",
  "th",
  "lo",
  "km",
  "my",
])

const DOCX_GROUPS = new Set(["ascii", "hAnsi", "eastAsia", "cs"])
const PPTX_GROUPS = new Set(["latin", "ea", "cs"])

const LANGUAGE_ALIASES: Record<string, string> = {
  english: "en",
  vietnamese: "vi",
  french: "fr",
  german: "de",
  spanish: "es",
  chinese: "zh",
  japanese: "ja",
  korean: "ko",
  arabic: "ar",
  hindi: "hi",
  thai: "th",
}

type FontFamily = "docx" | "pptx" | null

function normalizeLangCode(lang: LanguageCode | string | null | undefined): string {
  const value = String(lang ?? "").trim().toLowerCase()
  return LANGUAGE_ALIASES[value] ?? value
}

function detectFontFamily(fontsUsedByGroup: ParsedFontsByGroup): FontFamily {
  const groups = Object.keys(fontsUsedByGroup)

  if (groups.some((group) => group === "ascii" || group === "hAnsi" || group === "eastAsia")) {
    return "docx"
  }

  if (groups.some((group) => group === "latin" || group === "ea")) {
    return "pptx"
  }

  if (groups.some((group) => DOCX_GROUPS.has(group))) {
    return "docx"
  }

  if (groups.some((group) => PPTX_GROUPS.has(group))) {
    return "pptx"
  }

  return null
}

export function resolveTargetFontGroups(
  fontsUsedByGroup: ParsedFontsByGroup,
  targetLanguage: LanguageCode | string | null | undefined
): string[] {
  const family = detectFontFamily(fontsUsedByGroup)
  const lang = normalizeLangCode(targetLanguage)

  if (family === "docx") {
    if (EAST_ASIAN_LANGS.has(lang)) {
      return ["eastAsia"]
    }

    if (COMPLEX_SCRIPT_LANGS.has(lang)) {
      return ["cs"]
    }

    return ["ascii", "hAnsi"]
  }

  if (family === "pptx") {
    if (EAST_ASIAN_LANGS.has(lang)) {
      return ["ea"]
    }

    if (COMPLEX_SCRIPT_LANGS.has(lang)) {
      return ["cs"]
    }

    return ["latin"]
  }

  return Object.keys(fontsUsedByGroup)
}

export function extractTargetFonts(
  fontsUsedByGroup: ParsedFontsByGroup,
  targetLanguage: LanguageCode | string | null | undefined
): string[] {
  const groups = resolveTargetFontGroups(fontsUsedByGroup, targetLanguage)

  return [
    ...new Set(
      groups
        .flatMap((group) => fontsUsedByGroup[group] ?? [])
        .map((font) => font.trim())
        .filter((font) => font.length > 0)
    ),
  ]
}
