// Feature: Document Translation

// Components
export {
  TranslationStepper,
  StepUpload,
  StepConfigure,
  StepReview,
  DocumentTranslationWizard,
} from "./components"

// Types
export type {
  LanguageCode,
  Language,
  Domain,
  Tone,
  GlossaryTerm,
  ManualTerm,
  UploadedFile,
  JobStatus,
  TranslationFlowStatus,
  TranslationConfig,
  TranslationStep,
  RequestUploadUrlDto,
  UploadUrlResponse,
  UpdateFileStatusDto,
  FileResponse,
  CreateTranslationJobDto,
  TranslationJobResponse,
  FileDownloadUrlResponse,
} from "./types"

export { LANGUAGE_CODE_TO_API_NAME } from "./types"

// Data
export {
  languages,
  sourceLanguages,
  targetLanguages,
  domains,
  tones,
  defaultConfig,
} from "./data"

// Hooks
export {
  useUploadAndTranslate,
  useTranslationJob,
  useDownloadFile,
} from "./hooks"
