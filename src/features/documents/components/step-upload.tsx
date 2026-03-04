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
} from "lucide-react"
import { useTranslations } from "next-intl"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ALLOWED_EXTENSIONS, type UploadedFile } from "../types"

interface StepUploadProps {
  file: UploadedFile | null
  error: string | null
  isDragging: boolean
  onFileSelect: (file: File) => void
  onFileRemove: () => void
  onDragChange: (dragging: boolean) => void
  onNext: () => void
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

function getFileIcon(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase()
  if (ext === "pdf") return <FileText className="size-12 text-destructive" />
  if (ext === "pptx") return <Presentation className="size-12 text-warning" />
  return <File className="size-12 text-primary" />
}

export function StepUpload({
  file,
  error,
  isDragging,
  onFileSelect,
  onFileRemove,
  onDragChange,
  onNext,
}: StepUploadProps) {
  const t = useTranslations("documents.upload")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      onDragChange(false)
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) onFileSelect(droppedFile)
    },
    [onFileSelect, onDragChange]
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
      const selectedFile = e.target.files?.[0]
      if (selectedFile) onFileSelect(selectedFile)
    },
    [onFileSelect]
  )

  const handleRemove = useCallback(() => {
    onFileRemove()
    if (inputRef.current) inputRef.current.value = ""
  }, [onFileRemove])

  const isValid = file !== null && error === null

  const openPicker = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleDropzoneKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        openPicker()
      }
    },
    [openPicker]
  )

  return (
    <div className="mx-auto max-w-3xl">
      <Card
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
        <CardContent className="p-0">
          {/* Dropzone area */}
          {!file ? (
            <div
              role="button"
              tabIndex={0}
              onClick={openPicker}
              onKeyDown={handleDropzoneKeyDown}
              className="relative cursor-pointer p-8 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:p-10"
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
                    PPTX
                  </span>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      openPicker()
                    }}
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
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                  {!error && (
                    <div className="mt-2 flex items-center gap-2 text-success">
                      <Check className="size-4" />
                      <span className="text-sm font-medium">{t("fileReady")}</span>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button type="button" variant="secondary" size="sm" onClick={openPicker}>
                      <Upload className="size-3.5" />
                      {t("replaceFile")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error message */}
      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-destructive">
          <AlertCircle className="size-5 shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Next button */}
      <div className="mt-8 flex justify-end">
        <Button onClick={onNext} disabled={!isValid} size="lg">
          {t("next")}
        </Button>
      </div>

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_EXTENSIONS.join(",")}
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  )
}
