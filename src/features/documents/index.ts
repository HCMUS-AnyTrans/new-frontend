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
  Glossary,
  ManualTerm,
  UploadedFile,
  JobStatus,
  TranslationJob,
  TranslationConfig,
  TranslationStep,
} from "./types"

// Data
export {
  languages,
  sourceLanguages,
  targetLanguages,
  domains,
  tones,
  mockGlossaries,
  mockOriginalText,
  mockTranslatedText,
  defaultConfig,
} from "./data"
