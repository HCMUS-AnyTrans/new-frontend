// =============== LANGUAGE TYPES ===============

export type LanguageCode =
  | "auto"
  | "en"
  | "vi"
  | "ja"
  | "ko"
  | "zh"
  | "fr"
  | "de"
  | "es"

export interface Language {
  code: LanguageCode
  name: string
}

// =============== DOMAIN TYPES ===============

export interface Domain {
  id: string
  name: string
  icon: string
}

// =============== TONE TYPES ===============

export interface Tone {
  id: string
  name: string
  description: string
}

// =============== GLOSSARY TYPES ===============

export interface GlossaryTerm {
  src: string
  tgt: string
}

export interface Glossary {
  id: string
  name: string
  terms: GlossaryTerm[]
}

export interface ManualTerm {
  id: string
  src: string
  tgt: string
}

// =============== FILE TYPES ===============

export interface UploadedFile {
  name: string
  size: number
  type: string
  file: File
}

export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
] as const

export const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".pptx"]

export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

// =============== JOB TYPES ===============

export type JobStatus = "idle" | "processing" | "success" | "failed"

export interface TranslationJob {
  id: string
  status: JobStatus
  progress: number
  costCredits: number
  error?: string
}

// =============== CONFIG TYPES ===============

export interface TranslationConfig {
  srcLang: LanguageCode
  tgtLang: LanguageCode
  domain: string
  tone: string
  glossaryId: string | null
  manualTerms: ManualTerm[]
}

// =============== STEP TYPES ===============

export type TranslationStep = 1 | 2 | 3
