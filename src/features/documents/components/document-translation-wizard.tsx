"use client"

import { useState, useCallback } from "react"
import { useTranslations } from "next-intl"
import { TranslationStepper } from "./translation-stepper"
import { StepUpload } from "./step-upload"
import { StepConfigure } from "./step-configure"
import { StepReview } from "./step-review"
import {
  type TranslationStep,
  type TranslationConfig,
  type UploadedFile,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
} from "../types"
import { defaultConfig } from "../data"
import {
  useUploadAndTranslate,
  useTranslationJob,
  useDownloadFile,
} from "../hooks"

// =============== MAIN COMPONENT ===============

export function DocumentTranslationWizard() {
  const t = useTranslations("documents.upload")

  // Step state
  const [step, setStep] = useState<TranslationStep>(1)

  // Upload state
  const [file, setFile] = useState<UploadedFile | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Config state
  const [config, setConfig] = useState<TranslationConfig>(defaultConfig)

  // API hooks
  const {
    flowStatus,
    uploadProgress,
    jobId,
    error: flowError,
    startTranslation,
    reset: resetFlow,
  } = useUploadAndTranslate()

  const { data: jobData } = useTranslationJob(jobId, {
    enabled: flowStatus === "translating",
  })

  const { download, isDownloading } = useDownloadFile()

  // Update flow status when job polling returns a terminal state
  // The wizard tracks "succeeded" / "failed" based on job polling data
  const effectiveFlowStatus =
    jobData?.status === "succeeded"
      ? "succeeded"
      : jobData?.status === "failed"
        ? "failed"
        : flowStatus

  // =============== FILE HANDLERS ===============

  const validateFile = useCallback((f: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(f.type as (typeof ALLOWED_FILE_TYPES)[number])) {
      return t("errorUnsupported")
    }
    if (f.size > MAX_FILE_SIZE) {
      return t("errorTooLarge")
    }
    return null
  }, [t])

  const handleFileSelect = useCallback(
    (f: File) => {
      const error = validateFile(f)
      if (error) {
        setFileError(error)
        setFile(null)
        return
      }

      setFile({
        name: f.name,
        size: f.size,
        type: f.type,
        file: f,
      })
      setFileError(null)
    },
    [validateFile]
  )

  const handleFileRemove = useCallback(() => {
    setFile(null)
    setFileError(null)
  }, [])

  // =============== CONFIG HANDLERS ===============

  const handleConfigChange = useCallback((updates: Partial<TranslationConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }))
  }, [])

  // =============== NAVIGATION HANDLERS ===============

  const goToStep = useCallback((newStep: TranslationStep) => {
    setStep(newStep)
  }, [])

  const handleUploadNext = useCallback(() => {
    if (file && !fileError) {
      goToStep(2)
    }
  }, [file, fileError, goToStep])

  const handleConfigBack = useCallback(() => {
    goToStep(1)
  }, [goToStep])

  // =============== TRANSLATION FLOW ===============

  const handleStartTranslation = useCallback(() => {
    if (!file) return

    // Move to step 3 immediately to show upload progress
    goToStep(3)

    // Start the real upload → confirm → create job flow
    startTranslation(file.file, config)
  }, [file, config, goToStep, startTranslation])

  // =============== RESULT HANDLERS ===============

  const handleDownload = useCallback(() => {
    const outputFileId = jobData?.output_file?.id
    if (!outputFileId) return

    const outputFileName = jobData?.output_file?.name || `translated-${file?.name || "document"}`
    download(outputFileId, outputFileName)
  }, [jobData, file, download])

  const handleReset = useCallback(() => {
    // Reset all states
    resetFlow()
    setStep(1)
    setFile(null)
    setFileError(null)
    setConfig(defaultConfig)
  }, [resetFlow])

  // =============== RENDER ===============

  return (
    <div className="flex h-full flex-col">
      {/* Stepper */}
      <TranslationStepper currentStep={step} className="mb-6" />

      {/* Step Content */}
      <div className="flex-1">
        {step === 1 && (
          <StepUpload
            file={file}
            error={fileError}
            isDragging={isDragging}
            onFileSelect={handleFileSelect}
            onFileRemove={handleFileRemove}
            onDragChange={setIsDragging}
            onNext={handleUploadNext}
          />
        )}

        {step === 2 && (
          <StepConfigure
            config={config}
            onConfigChange={handleConfigChange}
            onBack={handleConfigBack}
            onStart={handleStartTranslation}
            isLoading={flowStatus !== "idle" && flowStatus !== "failed"}
          />
        )}

        {step === 3 && file && (
          <StepReview
            file={file}
            flowStatus={effectiveFlowStatus}
            uploadProgress={uploadProgress}
            jobData={jobData ?? null}
            error={flowError}
            srcLang={config.srcLang}
            tgtLang={config.tgtLang}
            onDownload={handleDownload}
            onReset={handleReset}
            isDownloading={isDownloading}
          />
        )}
      </div>
    </div>
  )
}
