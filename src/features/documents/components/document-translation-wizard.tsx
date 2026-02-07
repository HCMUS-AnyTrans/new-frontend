"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { TranslationStepper } from "./translation-stepper"
import { StepUpload } from "./step-upload"
import { StepConfigure } from "./step-configure"
import { StepReview } from "./step-review"
import {
  type TranslationStep,
  type TranslationConfig,
  type TranslationJob,
  type UploadedFile,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
} from "../types"
import {
  defaultConfig,
  mockGlossaries,
  mockOriginalText,
  mockTranslatedText,
} from "../data"

// =============== INITIAL STATES ===============

const initialJob: TranslationJob = {
  id: "",
  status: "idle",
  progress: 0,
  costCredits: 25,
}

// =============== MAIN COMPONENT ===============

export function DocumentTranslationWizard() {
  // Step state
  const [step, setStep] = useState<TranslationStep>(1)

  // Upload state
  const [file, setFile] = useState<UploadedFile | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Config state
  const [config, setConfig] = useState<TranslationConfig>(defaultConfig)

  // Job state
  const [job, setJob] = useState<TranslationJob>(initialJob)

  // Translation content
  const [translatedContent, setTranslatedContent] = useState("")

  // Ref for progress interval
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // =============== FILE HANDLERS ===============

  const validateFile = useCallback((f: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(f.type as (typeof ALLOWED_FILE_TYPES)[number])) {
      return "Định dạng file không được hỗ trợ. Vui lòng chọn file PDF, DOCX hoặc PPTX."
    }
    if (f.size > MAX_FILE_SIZE) {
      return "File quá lớn. Kích thước tối đa là 50MB."
    }
    return null
  }, [])

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

  // =============== TRANSLATION SIMULATION ===============

  const simulateTranslation = useCallback(() => {
    // Reset previous state
    setTranslatedContent("")
    setJob({
      id: `job-${Date.now()}`,
      status: "processing",
      progress: 0,
      costCredits: 25,
    })

    // Clear any existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }

    // Simulate progress
    let progress = 0
    progressIntervalRef.current = setInterval(() => {
      progress += Math.random() * 15 + 5

      if (progress >= 100) {
        progress = 100
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current)
          progressIntervalRef.current = null
        }

        // Complete with success
        setJob((prev) => ({
          ...prev,
          status: "success",
          progress: 100,
        }))
        setTranslatedContent(mockTranslatedText)
      } else {
        setJob((prev) => ({
          ...prev,
          progress: Math.round(progress),
        }))
      }
    }, 300)
  }, [])

  const handleStartTranslation = useCallback(() => {
    goToStep(3)
    // Start simulation after a short delay to let the UI render
    setTimeout(() => {
      simulateTranslation()
    }, 100)
  }, [goToStep, simulateTranslation])

  // =============== RESULT HANDLERS ===============

  const handleDownload = useCallback(() => {
    // In a real app, this would trigger a download of the translated document
    const blob = new Blob([translatedContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `translated-${file?.name || "document"}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [translatedContent, file])

  const handleReset = useCallback(() => {
    // Clear interval if running
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }

    // Reset all states
    setStep(1)
    setFile(null)
    setFileError(null)
    setConfig(defaultConfig)
    setJob(initialJob)
    setTranslatedContent("")
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [])

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
            glossaries={mockGlossaries}
            onConfigChange={handleConfigChange}
            onBack={handleConfigBack}
            onStart={handleStartTranslation}
            isLoading={false}
          />
        )}

        {step === 3 && file && (
          <StepReview
            file={file}
            config={config}
            job={job}
            originalText={mockOriginalText}
            translatedText={translatedContent}
            onDownload={handleDownload}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  )
}
