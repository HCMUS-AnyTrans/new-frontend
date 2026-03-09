"use client"

import { useRef, useCallback } from "react"
import {
  FileText,
  File,
  X,
  Check,
  AlertCircle,
  Presentation,
  Upload,
  HardDrive,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  CloudUpload,
  ScanSearch,
  ArrowRight,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
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
  pipelineStatus?: UploadPipelineStatus
  uploadProgress?: number
  uploadError?: string | null
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

function getFileIcon(fileName: string, size: "sm" | "md" | "lg" = "md") {
  const ext = fileName.split(".").pop()?.toLowerCase()
  const sizeClass = size === "sm" ? "size-8" : size === "lg" ? "size-14" : "size-10"
  if (ext === "pdf") return <FileText className={cn(sizeClass, "text-destructive")} />
  if (ext === "pptx" || ext === "ppt") return <Presentation className={cn(sizeClass, "text-warning")} />
  return <File className={cn(sizeClass, "text-primary")} />
}

const FILE_TYPES = ["PDF", "DOCX", "DOC", "PPTX", "PPT"]

const PIPELINE_STEPS = [
  { key: "uploading", icon: CloudUpload, label: "pipelineUploading" },
  { key: "confirming", icon: CheckCircle2, label: "pipelineConfirming" },
  { key: "analyzing", icon: ScanSearch, label: "pipelineAnalyzing" },
] as const

type PipelineStepKey = (typeof PIPELINE_STEPS)[number]["key"]

function getPipelineStepState(
  stepKey: PipelineStepKey,
  currentStatus: UploadPipelineStatus
): "pending" | "active" | "done" {
  const order: PipelineStepKey[] = ["uploading", "confirming", "analyzing"]
  const currentIdx = order.indexOf(currentStatus as PipelineStepKey)
  const stepIdx = order.indexOf(stepKey)
  if (currentIdx < 0) return "pending"
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

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault() }, [])
  const handleDragEnter = useCallback((e: React.DragEvent) => { e.preventDefault(); onDragChange(true) }, [onDragChange])
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); onDragChange(false) }, [onDragChange])

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
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openPicker() }
    },
    [openPicker]
  )

  return (
    <div className="mx-auto max-w-2xl">
      {/* ── Dropzone / File Preview ── */}
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border-2 transition-all duration-200",
          isDragging
            ? "border-primary bg-primary/5 shadow-[0_0_0_4px_hsl(var(--primary)/0.12)]"
            : file
              ? "border-border bg-card"
              : "border-dashed border-border bg-card hover:border-primary/50 hover:bg-primary/2"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        {/* Background gradient (only when no file) */}
        {!file && (
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,hsl(var(--primary)/0.08),transparent)]" />
        )}

        {!file ? (
          /* ── Empty dropzone ── */
          <div
            role="button"
            tabIndex={isBusy ? -1 : 0}
            onClick={openPicker}
            onKeyDown={handleDropzoneKeyDown}
            className={cn(
              "relative flex flex-col items-center px-6 py-10 text-center outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:py-14",
              isBusy ? "cursor-not-allowed opacity-60" : "cursor-pointer"
            )}
            aria-disabled={isBusy}
          >
            {/* Upload icon */}
            <div className="relative mb-5">
              <div
                className={cn(
                  "absolute -inset-2.5 rounded-2xl border-2 border-dashed transition-all duration-300",
                  isDragging ? "border-primary opacity-70 scale-110" : "border-primary/20 opacity-60"
                )}
              />
              <div className="relative flex size-16 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-sm sm:size-20">
                <Upload className="size-7 sm:size-9" />
              </div>
            </div>

            <h3 className="text-base font-semibold text-foreground sm:text-xl">
              {t("dropzone")}
            </h3>
            <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
              {t("dragHint")}
            </p>

            {/* File type badges */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
              {FILE_TYPES.map((ext) => (
                <span
                  key={ext}
                  className="rounded-md border border-border bg-muted/60 px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                  {ext}
                </span>
              ))}
            </div>

            {/* CTA button */}
            <Button
              type="button"
              size="lg"
              className="mt-6 gap-2 shadow-sm"
              onClick={(e) => { e.stopPropagation(); openPicker() }}
              disabled={isBusy}
            >
              <Upload className="size-4" />
              {t("browse")}
            </Button>

            {/* Info row */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <HardDrive className="size-3.5 shrink-0" />
                {t("maxSize")}
              </span>
              <span className="hidden sm:block text-border">•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 shrink-0" />
                {t("secureHint")}
              </span>
            </div>
          </div>
        ) : (
          /* ── File selected ── */
          <div className="p-4 sm:p-6">
            {/* File info row */}
            <div className="flex items-start gap-3 sm:gap-4">
              {/* File type icon */}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/40 sm:h-16 sm:w-16">
                {getFileIcon(file.name, "sm")}
              </div>

              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="truncate text-sm font-semibold text-foreground sm:text-base">
                      {file.name}
                    </h4>
                    <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemove}
                    disabled={isBusy}
                    className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="size-4" />
                  </Button>
                </div>

                {/* Ready badge */}
                {!error && pipelineStatus === "idle" && (
                  <div className="mt-2">
                    <Badge variant="outline" className="gap-1.5 border-success/30 bg-success/10 text-success text-xs">
                      <Check className="size-3" />
                      {t("fileReady")}
                    </Badge>
                  </div>
                )}

                {/* Replace button */}
                <div className="mt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={openPicker}
                    disabled={isBusy}
                    className="h-8 gap-1.5 text-xs"
                  >
                    <Upload className="size-3" />
                    {t("replaceFile")}
                  </Button>
                </div>
              </div>
            </div>

            {/* Pipeline progress */}
            {isBusy && (
              <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
                {pipelineStatus === "uploading" && (
                  <div className="mb-3">
                    <Progress value={uploadProgress} className="h-1.5" />
                  </div>
                )}

                {/* Steps */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {PIPELINE_STEPS.map((step, idx) => {
                    const state = getPipelineStepState(step.key, pipelineStatus)
                    const Icon = step.icon
                    return (
                      <div key={step.key} className="flex items-center gap-1 sm:gap-2">
                        {idx > 0 && (
                          <div className={cn("h-px w-3 sm:w-6 shrink-0", state === "pending" ? "bg-border" : "bg-primary/40")} />
                        )}
                        <div
                          className={cn(
                            "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-all",
                            state === "done" && "bg-primary/15 text-primary",
                            state === "active" && "bg-primary/20 text-primary ring-2 ring-primary/20",
                            state === "pending" && "bg-muted text-muted-foreground"
                          )}
                        >
                          {state === "done" ? (
                            <CheckCircle2 className="size-3.5 shrink-0" />
                          ) : state === "active" ? (
                            <Loader2 className="size-3.5 shrink-0 animate-spin" />
                          ) : (
                            <Icon className="size-3.5 shrink-0" />
                          )}
                          <span className="hidden sm:inline">
                            {t(step.label, { defaultMessage: step.key })}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {displayError && (
        <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/8 p-3.5 text-destructive sm:mt-4">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span className="text-sm font-medium">{displayError}</span>
        </div>
      )}

      {/* Next button */}
      <div className="mt-6 flex justify-end sm:mt-8">
        <Button
          onClick={onNext}
          disabled={!isValid || isBusy}
          size="lg"
          className="w-full gap-2 sm:w-auto"
        >
          {isBusy ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {t("next")}
            </>
          ) : (
            <>
              {t("next")}
              <ArrowRight className="size-4" />
            </>
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
