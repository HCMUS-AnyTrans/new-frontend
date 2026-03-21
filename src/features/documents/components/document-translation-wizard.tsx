"use client"

import { useState, useCallback, useMemo, useEffect, useRef } from "react"
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
  LANGUAGE_CODE_TO_API_NAME,
} from "../types"
import { defaultConfig } from "../data"
import {
  useUploadAndTranslate,
  useTranslationJob,
  useDownloadFile,
  useFontCheck,
} from "../hooks"
import { useGlossaries, useTerms } from "@/features/glossary"
import { useWallet } from "@/features/dashboard/hooks"
import { useTranslationStore } from "../store/translation.store"
import type { FontCheckItem, FontEnabledMap, FontReplacement, FontSelectionMap, LanguageCode } from "../types"

function buildDefaultFontSelections(items: FontCheckItem[]): FontSelectionMap {
  return items.reduce<FontSelectionMap>((acc, item) => {
    acc[item.from_font] = item.to_font || item.from_font
    return acc
  }, {})
}

function reconcileFontEnabledMap(
  items: FontCheckItem[],
  currentEnabledMap: FontEnabledMap
): FontEnabledMap {
  return items.reduce<FontEnabledMap>((acc, item) => {
    acc[item.from_font] = currentEnabledMap[item.from_font] ?? true
    return acc
  }, {})
}

function reconcileFontSelections(
  items: FontCheckItem[],
  currentSelections: FontSelectionMap
): FontSelectionMap {
  return items.reduce<FontSelectionMap>((acc, item) => {
    const current = currentSelections[item.from_font]
    const allowed = new Set([item.from_font, item.to_font, ...item.replacement_candidates])

    acc[item.from_font] = current && allowed.has(current) ? current : item.to_font || item.from_font
    return acc
  }, {})
}

function buildFontReplacements(
  items: FontCheckItem[],
  fontSelections: FontSelectionMap,
  fontConfigEnabled: boolean,
  fontEnabledMap: FontEnabledMap
): FontReplacement[] {
  if (!fontConfigEnabled) {
    return []
  }

  return items
    .map((item) => {
      if (!(fontEnabledMap[item.from_font] ?? true)) {
        return null
      }

      const selected = fontSelections[item.from_font] ?? item.to_font ?? item.from_font
      const allowed = new Set([item.from_font, item.to_font, ...item.replacement_candidates])

      if (!selected || !allowed.has(selected)) {
        return null
      }

      if (item.supported && selected === item.from_font) {
        return null
      }

      if (!item.supported || selected !== item.from_font) {
        return {
          from_font: item.from_font,
          to_font: selected,
        }
      }

      return null
    })
    .filter((item): item is FontReplacement => item !== null)
}

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
    estimate,
    analysisFile,
    fontsUsedByGroup,
    fontParseSupported,
    fontFlowUnavailable,
    jobId,
    error: flowError,
    startUpload,
    startTranslation,
    reset: resetFlow,
    restoreJob,
  } = useUploadAndTranslate()

  // On mount: if the store has an active job but this wizard has no local jobId
  // (e.g. user navigated away and came back), restore the translating state so
  // the polling fallback and UI can resume correctly.
  const storeActiveJobId = useTranslationStore((s) => s.activeJobId)
  const socketConnectionState = useTranslationStore((s) => s.connectionState)
  useEffect(() => {
    if (storeActiveJobId && !jobId) {
      restoreJob(storeActiveJobId)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const translationPollInterval =
    flowStatus === "translating" && socketConnectionState === "connected" ? false : 3000

  const { data: jobData } = useTranslationJob(jobId, {
    enabled: flowStatus === "translating",
    pollInterval: translationPollInterval,
  })

  const { download, isDownloading } = useDownloadFile()
  const { wallet, isLoading: isLoadingWallet } = useWallet()
  const previousTargetLangRef = useRef<LanguageCode>(config.tgtLang)

  const { data: fontCheckState, isLoading: isCheckingFonts } = useFontCheck(
    fileId,
    analysisFile?.id ? LANGUAGE_CODE_TO_API_NAME[config.tgtLang] : null,
    fontsUsedByGroup,
    fontParseSupported
  )
  const fontCheckItems = useMemo(() => fontCheckState?.items ?? [], [fontCheckState?.items])
  const fontCheckUnavailable = fontCheckState?.fontCheckUnavailable ?? false

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

  // Estimate is now provided by the upload hook (polled during Step 1 analyzing phase).
  // It is already available by the time the user reaches Step 2.
  const isEstimating = false

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

  const handleFontSelectionChange = useCallback((fromFont: string, toFont: string) => {
    setConfig((prev) => ({
      ...prev,
      fontSelections: {
        ...prev.fontSelections,
        [fromFont]: toFont,
      },
    }))
  }, [])

  const handleFontConfigEnabledChange = useCallback((enabled: boolean) => {
    setConfig((prev) => ({
      ...prev,
      fontConfigEnabled: enabled,
    }))
  }, [])

  const handleKeepOriginalFontSizeChange = useCallback((enabled: boolean) => {
    setConfig((prev) => ({
      ...prev,
      keepOriginalFontSize: enabled,
    }))
  }, [])

  const handleFontEnabledChange = useCallback((fromFont: string, enabled: boolean) => {
    setConfig((prev) => ({
      ...prev,
      fontEnabledMap: {
        ...prev.fontEnabledMap,
        [fromFont]: enabled,
      },
    }))
  }, [])

  useEffect(() => {
    const targetChanged = previousTargetLangRef.current !== config.tgtLang

    setConfig((prev) => {
      if (fontCheckItems.length === 0) {
        if (
          !targetChanged ||
          (Object.keys(prev.fontSelections).length === 0 && Object.keys(prev.fontEnabledMap).length === 0)
        ) {
          return prev
        }

        return {
          ...prev,
          fontConfigEnabled: true,
          fontEnabledMap: {},
          fontSelections: {},
        }
      }

      const nextSelections = targetChanged
        ? buildDefaultFontSelections(fontCheckItems)
        : reconcileFontSelections(fontCheckItems, prev.fontSelections)
      const nextEnabledMap = reconcileFontEnabledMap(fontCheckItems, prev.fontEnabledMap)

      const selectionsUnchanged =
        Object.keys(nextSelections).length === Object.keys(prev.fontSelections).length &&
        Object.entries(nextSelections).every(([key, value]) => prev.fontSelections[key] === value)
      const enabledMapUnchanged =
        Object.keys(nextEnabledMap).length === Object.keys(prev.fontEnabledMap).length &&
        Object.entries(nextEnabledMap).every(([key, value]) => prev.fontEnabledMap[key] === value)
      const nextFontConfigEnabled = targetChanged || !enabledMapUnchanged ? true : prev.fontConfigEnabled

      if (selectionsUnchanged && enabledMapUnchanged && nextFontConfigEnabled === prev.fontConfigEnabled) {
        return prev
      }

      return {
        ...prev,
        fontConfigEnabled: nextFontConfigEnabled,
        fontEnabledMap: nextEnabledMap,
        fontSelections: nextSelections,
      }
    })

    previousTargetLangRef.current = config.tgtLang
  }, [config.tgtLang, fontCheckItems])

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
    const fontReplacements = buildFontReplacements(
      fontCheckItems,
      config.fontSelections,
      config.fontConfigEnabled,
      config.fontEnabledMap
    )

    // Start the translation job for the already-uploaded file
    startTranslation(config, usableGlossaryTerms, fontReplacements)
  }, [
    file,
    fileId,
    config,
    activeSelectedGlossaryId,
    selectedGlossaryTerms,
    goToStep,
    startTranslation,
    fontCheckItems,
  ])

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
            pipelineStatus={
              flowStatus === "uploading"
                ? "uploading"
                : flowStatus === "confirming"
                  ? "confirming"
                  : flowStatus === "analyzing"
                    ? "analyzing"
                    : flowStatus === "failed"
                      ? "failed"
                      : "idle"
            }
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
            estimate={estimate ?? undefined}
            isEstimating={isEstimating}
            estimateError={null}
            currentBalance={wallet?.balance}
            isLoadingBalance={isLoadingWallet}
            fontsUsedByGroup={fontsUsedByGroup}
            fontCheckItems={fontCheckItems}
            keepOriginalFontSize={config.keepOriginalFontSize}
            fontConfigEnabled={config.fontConfigEnabled}
            fontEnabledMap={config.fontEnabledMap}
            fontParseSupported={fontParseSupported}
            fontFlowUnavailable={fontFlowUnavailable}
            fontCheckUnavailable={fontCheckUnavailable}
            isCheckingFonts={isCheckingFonts}
            onKeepOriginalFontSizeChange={handleKeepOriginalFontSizeChange}
            onFontConfigEnabledChange={handleFontConfigEnabledChange}
            onFontEnabledChange={handleFontEnabledChange}
            onFontSelectionChange={handleFontSelectionChange}
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
