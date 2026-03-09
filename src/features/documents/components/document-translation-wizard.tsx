"use client"

import { useState, useCallback, useMemo } from "react"
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
  useEstimateCredits,
} from "../hooks"
import { useGlossaries, useTerms } from "@/features/glossary"
import { useWallet } from "@/features/dashboard/hooks"

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
    fileId,
    jobId,
    error: flowError,
    startUpload,
    startTranslation,
    reset: resetFlow,
  } = useUploadAndTranslate()

  const { data: jobData } = useTranslationJob(jobId, {
    enabled: flowStatus === "translating",
  })

  const { download, isDownloading } = useDownloadFile()
  const { wallet, isLoading: isLoadingWallet } = useWallet()

  const glossaryFilters = useMemo(
    () => ({
      page: 1,
      limit: 100,
      srcLang: config.srcLang,
      tgtLang: config.tgtLang,
    }),
    [config.srcLang, config.tgtLang]
  )

  const {
    glossaries = [],
    isLoading: isLoadingGlossaries,
    isFetching: isFetchingGlossaries,
  } = useGlossaries(glossaryFilters)

  const activeSelectedGlossaryId =
    config.selectedGlossaryId && glossaries.some((item) => item.id === config.selectedGlossaryId)
      ? config.selectedGlossaryId
      : null

  const {
    terms: selectedGlossaryTerms = [],
    isLoading: isLoadingGlossaryTerms,
    isFetching: isFetchingGlossaryTerms,
  } = useTerms(activeSelectedGlossaryId, {
    page: 1,
    limit: 100,
    sortBy: "srcTerm",
    sortOrder: "asc",
  })

  const {
    data: estimate,
    isLoading: isEstimateLoading,
    isFetching: isEstimateFetching,
    error: estimateError,
  } = useEstimateCredits(fileId, {
    enabled: step === 2 && !!fileId,
  })
  const isEstimating = !!fileId && (isEstimateLoading || isEstimateFetching || !estimate)

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
      resetFlow()

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
        charCount: Math.max(1, Math.round(f.size / 4)),
        file: f,
      })
      setFileError(null)
    },
    [resetFlow, validateFile]
  )

  const handleFileRemove = useCallback(() => {
    resetFlow()
    setFile(null)
    setFileError(null)
  }, [resetFlow])

  // =============== CONFIG HANDLERS ===============

  const handleConfigChange = useCallback((updates: Partial<TranslationConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }))
  }, [])

  // =============== NAVIGATION HANDLERS ===============

  const goToStep = useCallback((newStep: TranslationStep) => {
    setStep(newStep)
  }, [])

  const handleUploadNext = useCallback(async () => {
    if (!file || fileError) return

    try {
      const uploadedFileId = await startUpload(file.file)
      if (uploadedFileId) {
        goToStep(2)
      }
    } catch {
      // Upload errors are already captured in the flow state.
    }
  }, [file, fileError, goToStep, startUpload])

  const handleConfigBack = useCallback(() => {
    goToStep(1)
  }, [goToStep])

  // =============== TRANSLATION FLOW ===============

  const handleStartTranslation = useCallback(() => {
    if (!file || !fileId) return

    // Move to step 3 immediately to show upload progress
    goToStep(3)

    const usableGlossaryTerms = activeSelectedGlossaryId ? selectedGlossaryTerms : []

    // Start the translation job for the already-uploaded file
    startTranslation(config, usableGlossaryTerms)
  }, [file, fileId, config, activeSelectedGlossaryId, selectedGlossaryTerms, goToStep, startTranslation])

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
            isUploading={flowStatus === "uploading" || flowStatus === "confirming"}
            uploadProgress={uploadProgress}
            uploadError={flowError}
          />
        )}

        {step === 2 && (
          <StepConfigure
            config={{ ...config, selectedGlossaryId: activeSelectedGlossaryId }}
            onConfigChange={handleConfigChange}
            glossaries={glossaries}
            selectedGlossaryTerms={selectedGlossaryTerms}
            isLoadingGlossaries={isLoadingGlossaries || isFetchingGlossaries}
            isLoadingGlossaryTerms={isLoadingGlossaryTerms || isFetchingGlossaryTerms}
            estimate={estimate}
            isEstimating={isEstimating}
            estimateError={
              !isEstimating && estimateError && typeof estimateError === "object" && "message" in estimateError
                ? String(estimateError.message)
                : null
            }
            currentBalance={wallet?.balance}
            isLoadingBalance={isLoadingWallet}
            onBack={handleConfigBack}
            onStart={handleStartTranslation}
            isLoading={flowStatus === "creating" || flowStatus === "translating"}
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
