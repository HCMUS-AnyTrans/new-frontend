import type { Language, Domain, Tone, TranslationConfig } from "../types"

// =============== LANGUAGES ===============

export const languages: Language[] = [
  { code: "auto", name: "Tự động phát hiện", apiName: "auto" },
  { code: "en", name: "English", apiName: "English" },
  { code: "vi", name: "Tiếng Việt", apiName: "Vietnamese" },
  { code: "ja", name: "日本語", apiName: "Japanese" },
  { code: "ko", name: "한국어", apiName: "Korean" },
  { code: "zh", name: "中文", apiName: "Chinese" },
  { code: "fr", name: "Français", apiName: "French" },
  { code: "de", name: "Deutsch", apiName: "German" },
  { code: "es", name: "Español", apiName: "Spanish" },
]

export const sourceLanguages = languages
export const targetLanguages = languages.filter((l) => l.code !== "auto")

// =============== DOMAINS ===============

export const domains: Domain[] = [
  { id: "general", name: "Tổng quát", icon: "📋" },
  { id: "tech", name: "Công nghệ", icon: "💻" },
  { id: "medical", name: "Y tế", icon: "⚕️" },
  { id: "legal", name: "Pháp lý", icon: "⚖️" },
  { id: "finance", name: "Tài chính", icon: "💰" },
  { id: "marketing", name: "Marketing", icon: "📢" },
]

// =============== TONES ===============

export const tones: Tone[] = [
  { id: "formal", name: "Trang trọng", description: "Phù hợp văn bản chính thức" },
  { id: "casual", name: "Thân mật", description: "Phù hợp giao tiếp hàng ngày" },
  { id: "professional", name: "Chuyên nghiệp", description: "Phù hợp môi trường công việc" },
  { id: "friendly", name: "Thân thiện", description: "Gần gũi, dễ hiểu" },
]

// =============== DEFAULT CONFIG ===============

export const defaultConfig: TranslationConfig = {
  srcLang: "auto",
  tgtLang: "vi",
  domain: "general",
  tone: "professional",
  manualTerms: [],
}
