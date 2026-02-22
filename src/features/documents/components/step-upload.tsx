"use client"

import { useRef, useCallback } from "react"
import { Upload, FileText, File, X, Check, AlertCircle, Presentation } from "lucide-react"
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

  return (
    <div className="mx-auto max-w-2xl">
      <Card
        className={cn(
          "overflow-hidden border-2 border-dashed transition-all",
          isDragging ? "border-primary bg-primary/5" : "border-border"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="p-0">
          {/* Dropzone area */}
          {!file ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
                <span className="text-3xl">📄</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                {t("dropzone")}
              </h3>
              <p className="mb-6 text-muted-foreground">{t("or")}</p>
              <Button onClick={() => inputRef.current?.click()}>
                <Upload className="size-4" />
                {t("browse")}
              </Button>
              <p className="mt-4 text-sm text-muted-foreground">
                {t("supportedFormats", { extensions: ALLOWED_EXTENSIONS.join(", ") })}
              </p>
            </div>
          ) : (
            <div className="p-8">
              {/* File preview */}
              <div className="flex items-start gap-4 rounded-xl border border-border bg-muted/30 p-4">
                <div className="shrink-0">{getFileIcon(file.name)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate font-semibold text-foreground">{file.name}</h4>
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
                      <span className="text-sm font-medium">{t("valid")}</span>
                    </div>
                  )}
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
