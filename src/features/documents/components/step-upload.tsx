"use client"

import { useRef, useCallback } from "react"
import {
  Upload,
  FileText,
  File,
  X,
  Check,
  AlertCircle,
  Presentation,
  FileUp,
  HardDrive,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  CloudUpload,
  ScanSearch,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { AppCard, AppCardContent } from "@/components/ui/app-card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { ALLOWED_EXTENSIONS, type UploadedFile } from "../types"

type UploadPipelineStatus = "idle" | "uploading" | "confirming" | "analyzing" | "failed"

interface StepUploadProps {
  file: UploadedFile | null
  error: string | null
  isDragging: boolean
  onFileSelect: (file: File) => void
  onFileRemove: () => void
  onDragChange: (dragging: boolean) => void
  onNext: () => void
  /** Current pipeline status for the upload flow */
  pipelineStatus?: UploadPipelineStatus
  uploadProgress?: number
  uploadError?: string | null
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

function getFileIcon(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase()
  if (ext === "pdf") return <FileText className="size-12 text-destructive" />
  if (ext === "pptx" || ext === "ppt") return <Presentation className="size-12 text-warning" />
  return <File className="size-12 text-primary" />
}

// Pipeline step definitions for the progress indicator
const PIPELINE_STEPS = [
  { key: "uploading", icon: CloudUpload },
  { key: "confirming", icon: CheckCircle2 },
  { key: "analyzing", icon: ScanSearch },
] as const

type PipelineStepKey = (typeof PIPELINE_STEPS)[number]["key"]

function getPipelineStepState(
  stepKey: PipelineStepKey,
  currentStatus: UploadPipelineStatus
): "pending" | "active" | "done" {
  const order: PipelineStepKey[] = ["uploading", "confirming", "analyzing"]
  const currentIdx = order.indexOf(currentStatus as PipelineStepKey)
  const stepIdx = order.indexOf(stepKey)

  if (currentIdx < 0) return "pending" // idle or failed
  if (stepIdx < currentIdx) return "done"
  if (stepIdx === currentIdx) return "active"
  return "pending"
}

export function StepUpload({
  file,
  error,
  isDragging,
  onFileSelect,
  onFileRemove,
  onDragChange,
  onNext,
  pipelineStatus = "idle",
  uploadProgress = 0,
  uploadError,
}: StepUploadProps) {
  const t = useTranslations("documents.upload")
  const inputRef = useRef<HTMLInputElement>(null)

  const isBusy = pipelineStatus !== "idle" && pipelineStatus !== "failed"

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (isBusy) return
      onDragChange(false)
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) onFileSelect(droppedFile)
    },
    [isBusy, onFileSelect, onDragChange]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      onDragChange(true)
    },
    [onDragChange]
  )

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      onDragChange(false)
    },
    [onDragChange]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isBusy) return
      const selectedFile = e.target.files?.[0]
      if (selectedFile) onFileSelect(selectedFile)
    },
    [isBusy, onFileSelect]
  )

  const handleRemove = useCallback(() => {
    onFileRemove()
    if (inputRef.current) inputRef.current.value = ""
  }, [onFileRemove])

  const isValid = file !== null && error === null
  const displayError = error || uploadError

  const openPicker = useCallback(() => {
    if (isBusy) return
    inputRef.current?.click()
  }, [isBusy])

  const handleDropzoneKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        openPicker()
      }
    },
    [openPicker]
  )

  // Pipeline step labels
  const pipelineLabels: Record<PipelineStepKey, string> = {
    uploading: t("pipelineUploading", { defaultMessage: "Uploading" }),
    confirming: t("pipelineConfirming", { defaultMessage: "Confirming" }),
    analyzing: t("pipelineAnalyzing", { defaultMessage: "Analyzing" }),
  }

  return (
    <div className="mx-auto max-w-3xl">
      <AppCard
        className={cn(
          "overflow-hidden border-2 border-dashed transition-all duration-200",
          isDragging
            ? "border-primary bg-primary/10 shadow-[0_0_0_4px_hsl(var(--primary)/0.12)]"
            : "border-border"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <AppCardContent padding="none" className="p-0">
          {/* Dropzone area */}
          {!file ? (
            <div
                role="button"
                tabIndex={isBusy ? -1 : 0}
                onClick={openPicker}
                onKeyDown={handleDropzoneKeyDown}
                className={cn(
                  "relative p-8 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:p-10",
                  isBusy ? "cursor-not-allowed opacity-80" : "cursor-pointer"
                )}
                aria-disabled={isBusy}
              >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.10),transparent_55%)]" />
              <div className="relative flex flex-col items-center text-center">
                <div className="mb-5 flex size-16 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
                  <FileUp className="size-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{t("dropzone")}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("supportedFormats", { extensions: ALLOWED_EXTENSIONS.join(", ") })}
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                    PDF
                  </span>
                  <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                    DOCX
                  </span>
                  <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                    DOC
                  </span>
                  <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                    PPTX
                  </span>
                  <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                    PPT
                  </span>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      openPicker()
                    }}
                    disabled={isBusy}
                  >
                    <Upload className="size-4" />
                    {t("browse")}
                  </Button>
                  <span className="text-sm text-muted-foreground">{t("dragHint")}</span>
                </div>

                <div className="mt-6 grid w-full max-w-xl gap-2 sm:grid-cols-2">
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-left text-xs text-muted-foreground">
                    <HardDrive className="size-3.5 shrink-0" />
                    {t("maxSize")}
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-left text-xs text-muted-foreground">
                    <ShieldCheck className="size-3.5 shrink-0" />
                    {t("secureHint")}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-5 sm:p-6">
              {/* File preview */}
              <div className="flex items-start gap-4 rounded-xl border border-border bg-muted/30 p-4 sm:p-5">
                <div className="shrink-0 rounded-lg bg-background p-2">{getFileIcon(file.name)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-semibold text-foreground sm:text-base">
                        {file.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                     <Button
                       variant="ghost"
                       size="icon-sm"
                       onClick={handleRemove}
                       disabled={isBusy}
                       className="shrink-0 text-muted-foreground hover:text-destructive"
                     >
                       <X className="size-4" />
                    </Button>
                  </div>
                  {!error && pipelineStatus === "idle" && (
                    <div className="mt-2 flex items-center gap-2 text-success">
                      <Check className="size-4" />
                      <span className="text-sm font-medium">{t("fileReady")}</span>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button type="button" variant="secondary" size="sm" onClick={openPicker} disabled={isBusy}>
                      <Upload className="size-3.5" />
                      {t("replaceFile")}
                    </Button>
                  </div>

                  {/* Pipeline progress indicator */}
                  {isBusy && (
                    <div className="mt-4 space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                      {/* Upload progress bar (only during uploading phase) */}
                      {pipelineStatus === "uploading" && (
                        <div className="space-y-1.5">
                          <Progress value={uploadProgress} className="h-2" />
                          <p className="text-right text-xs text-muted-foreground">{uploadProgress}%</p>
                        </div>
                      )}

                      {/* Pipeline steps */}
                      <div className="flex items-center gap-1">
                        {PIPELINE_STEPS.map((step, idx) => {
                          const stepState = getPipelineStepState(step.key, pipelineStatus)
                          const Icon = step.icon
                          return (
                            <div key={step.key} className="flex items-center gap-1">
                              {idx > 0 && (
                                <div
                                  className={cn(
                                    "h-px w-4 sm:w-6",
                                    stepState === "pending" ? "bg-border" : "bg-primary/40"
                                  )}
                                />
                              )}
                              <div
                                className={cn(
                                  "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                                  stepState === "done" && "bg-primary/10 text-primary",
                                  stepState === "active" && "bg-primary/15 text-primary",
                                  stepState === "pending" && "bg-muted text-muted-foreground"
                                )}
                              >
                                {stepState === "done" ? (
                                  <CheckCircle2 className="size-3.5" />
                                ) : stepState === "active" ? (
                                  <Loader2 className="size-3.5 animate-spin" />
                                ) : (
                                  <Icon className="size-3.5" />
                                )}
                                <span className="hidden sm:inline">{pipelineLabels[step.key]}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </AppCardContent>
      </AppCard>

      {/* Error message */}
      {displayError && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-destructive">
          <AlertCircle className="size-5 shrink-0" />
          <span className="text-sm font-medium">{displayError}</span>
        </div>
      )}

      {/* Next button */}
      <div className="mt-8 flex justify-end">
        <Button onClick={onNext} disabled={!isValid || isBusy} size="lg">
          {isBusy ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {t("next")}
            </>
          ) : (
            t("next")
          )}
        </Button>
      </div>

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_EXTENSIONS.join(",")}
        onChange={handleInputChange}
        disabled={isBusy}
        className="hidden"
      />
    </div>
  )
}
