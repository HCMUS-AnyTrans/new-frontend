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
  /** Full language name used by the backend API (e.g. "English", "Vietnamese") */
  apiName: string
}

/**
 * Map language code to the full name the backend expects.
 * Backend uses full names like "English", "Vietnamese" — NOT codes like "en", "vi".
 */
export const LANGUAGE_CODE_TO_API_NAME: Record<Exclude<LanguageCode, "auto">, string> = {
  en: "English",
  vi: "Vietnamese",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
  fr: "French",
  de: "German",
  es: "Spanish",
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

/**
 * Job status values aligned with backend.
 * Backend uses: "pending" | "processing" | "succeeded" | "failed"
 */
export type JobStatus = "pending" | "processing" | "succeeded" | "failed"

// =============== API REQUEST/RESPONSE TYPES ===============

/** POST /files/upload/request — request body */
export interface RequestUploadUrlDto {
  file_name: string
  mime_type: string
  file_size: number
  file_type: "doc" | "sub"
  sha256?: string
  metadata?: Record<string, unknown>
}

/** POST /files/upload/request — response */
export interface UploadUrlResponse {
  upload_url: string
  file_id: string
  storage_key: string
  expires_in: number
}

/** PATCH /files/:file_id/status — request body */
export interface UpdateFileStatusDto {
  status: "uploaded" | "failed"
}

/** File metadata from backend */
export interface FileResponse {
  id: string
  name: string
  mime: string
  size_bytes: number
  sha256: string | null
  status: string
  type: string
  created_at: string
  store_until: string
  is_expired: boolean
}

/** POST /translations/doc — request body */
export interface CreateTranslationJobDto {
  file_id: string
  src_lang: string
  tgt_lang: string
  doc_tone?: string
  doc_domain?: string
  user_glossary?: { src_lang: string; tgt_lang: string }[]
  keep_original_font_size?: boolean
  keep_original_fonts?: boolean
  pdf_output_format?: "docx" | "pptx"
}

/** GET /translations/:job_id — response */
export interface TranslationJobResponse {
  job_id: string
  job_type: string
  status: JobStatus
  input_file?: FileResponse
  output_file?: FileResponse
  src_lang?: string
  tgt_lang?: string
  error?: string
  created_at?: string
  completed_at?: string
}

/** GET /files/:file_id/download — response */
export interface FileDownloadUrlResponse {
  download_url: string
}

// =============== UPLOAD FLOW STATE ===============

/**
 * Tracks the multi-step upload + translation flow:
 * idle → uploading → confirming → creating → translating → succeeded/failed
 */
export type TranslationFlowStatus =
  | "idle"
  | "uploading"
  | "confirming"
  | "creating"
  | "translating"
  | "succeeded"
  | "failed"

// =============== CONFIG TYPES ===============

export interface TranslationConfig {
  srcLang: LanguageCode
  tgtLang: LanguageCode
  domain: string
  tone: string
  manualTerms: ManualTerm[]
}

// =============== STEP TYPES ===============

export type TranslationStep = 1 | 2 | 3
