"use client"

import {
  Download,
  RefreshCcw,
  Loader2,
  CheckCircle2,
  XCircle,
  FileText,
  File,
  Presentation,
  Upload,
  AlertCircle,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { TranslationFlowStatus, TranslationJobResponse, UploadedFile } from "../types"
import type { LanguageCode } from "../types"

// =============== TYPES ===============

interface StepReviewProps {
  file: UploadedFile
  /** The multi-step flow status (uploading → confirming → creating → translating → succeeded/failed) */
  flowStatus: TranslationFlowStatus
  /** Upload progress percentage (0-100) during the "uploading" phase */
  uploadProgress: number
  /** Translation job data from polling (null until job is created) */
  jobData: TranslationJobResponse | null
  /** Error message from any step */
  error: string | null
  /** Source language code */
  srcLang: LanguageCode
  /** Target language code */
  tgtLang: LanguageCode
  onDownload: () => void
  onReset: () => void
  isDownloading?: boolean
}

// =============== HELPERS ===============

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

function getFileIcon(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase()
  if (ext === "pdf") return <FileText className="size-10 text-destructive" />
  if (ext === "pptx") return <Presentation className="size-10 text-warning" />
  return <File className="size-10 text-primary" />
}

// =============== UPLOADING STATE ===============

function UploadingCard({ progress, t }: { progress: number; t: (key: string) => string }) {
  return (
    <Card className="mx-auto max-w-lg">
      <CardContent className="p-8">
        <div className="space-y-6 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
            <Upload className="size-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{t("uploading")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("uploadingHint")}
            </p>
          </div>
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm font-medium text-primary">{progress}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// =============== PREPARING STATE (confirming upload / creating job) ===============

function PreparingCard({ t }: { t: (key: string) => string }) {
  return (
    <Card className="mx-auto max-w-lg">
      <CardContent className="p-8">
        <div className="space-y-6 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{t("preparing")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("preparingHint")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// =============== TRANSLATING STATE (indeterminate progress) ===============

function TranslatingCard({ t }: { t: (key: string) => string }) {
  return (
    <Card className="mx-auto max-w-lg">
      <CardContent className="p-8">
        <div className="space-y-6 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{t("translating")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("translatingHint")}
            </p>
          </div>
          {/* Indeterminate progress bar */}
          <div className="relative h-2 overflow-hidden rounded-full bg-muted">
            <div className="absolute inset-y-0 w-1/3 animate-[indeterminate_1.5s_ease-in-out_infinite] rounded-full bg-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// =============== SUCCESS STATE (download card) ===============

interface SuccessCardProps {
  file: UploadedFile
  jobData: TranslationJobResponse | null
  srcLang: LanguageCode
  tgtLang: LanguageCode
  onDownload: () => void
  isDownloading?: boolean
  t: (key: string) => string
  tLang: (key: string) => string
}

function SuccessCard({ file, jobData, srcLang, tgtLang, onDownload, isDownloading, t, tLang }: SuccessCardProps) {
  const outputFile = jobData?.output_file
  const outputFileName = outputFile?.name || `translated-${file.name}`
  const outputFileSize = outputFile?.size_bytes

  return (
    <Card className="mx-auto max-w-lg">
      <CardContent className="p-8">
        <div className="space-y-6">
          {/* Success header */}
          <div className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="size-8 text-success" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">{t("success")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("successHint")}
            </p>
          </div>

          {/* Translation info */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary">{tLang(srcLang === "auto" ? "en" : srcLang)}</Badge>
            <span>→</span>
            <Badge variant="secondary">{tLang(tgtLang)}</Badge>
          </div>

          {/* Output file card */}
          <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/30 p-4">
            <div className="shrink-0">{getFileIcon(outputFileName)}</div>
            <div className="min-w-0 flex-1">
              <h4 className="truncate font-semibold text-foreground">{outputFileName}</h4>
              {outputFileSize && (
                <p className="text-sm text-muted-foreground">{formatFileSize(outputFileSize)}</p>
              )}
            </div>
          </div>

          {/* Download button */}
          <Button onClick={onDownload} disabled={isDownloading} className="w-full" size="lg">
            {isDownloading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {t("downloading")}
              </>
            ) : (
              <>
                <Download className="size-4" />
                {t("download")}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// =============== FAILED STATE ===============

interface FailedCardProps {
  error: string | null
  jobError: string | null | undefined
  t: (key: string) => string
}

function FailedCard({ error, jobError, t }: FailedCardProps) {
  const errorMessage = error || jobError || t("unknownError")

  return (
    <Card className="mx-auto max-w-lg">
      <CardContent className="p-8">
        <div className="space-y-6 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive/10">
            <XCircle className="size-8 text-destructive" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{t("failed")}</h3>
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-left">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
              <p className="text-sm text-destructive">{errorMessage}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// =============== BOTTOM BAR ===============

interface BottomBarProps {
  flowStatus: TranslationFlowStatus
  jobStatus: string | undefined
  onReset: () => void
  t: (key: string) => string
}

function BottomBar({ flowStatus, jobStatus, onReset, t }: BottomBarProps) {
  const isFinished =
    flowStatus === "succeeded" ||
    flowStatus === "failed" ||
    jobStatus === "succeeded" ||
    jobStatus === "failed"

  return (
    <div className="mt-8 flex justify-center">
      <Button variant="outline" onClick={onReset} disabled={!isFinished}>
        <RefreshCcw className="size-4" />
        {t("newTranslation")}
      </Button>
    </div>
  )
}

// =============== MAIN COMPONENT ===============

export function StepReview({
  file,
  flowStatus,
  uploadProgress,
  jobData,
  error,
  srcLang,
  tgtLang,
  onDownload,
  onReset,
  isDownloading,
}: StepReviewProps) {
  const t = useTranslations("documents.review")
  const tLang = useTranslations("documents.languages")

  // Determine which card to show based on the combined flow + job status
  const jobStatus = jobData?.status
  const isTranslating =
    flowStatus === "translating" &&
    (jobStatus === "pending" || jobStatus === "processing" || !jobStatus)
  const isSucceeded =
    flowStatus === "succeeded" || jobStatus === "succeeded"
  const isFailed =
    flowStatus === "failed" || jobStatus === "failed"

  return (
    <div className="flex flex-col">
      {/* Document Title */}
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-foreground">{t("title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("document", { name: file.name })}</p>
      </div>

      {/* State-specific card */}
      <div className="flex-1">
        {flowStatus === "uploading" && (
          <UploadingCard progress={uploadProgress} t={t} />
        )}

        {(flowStatus === "confirming" || flowStatus === "creating") && (
          <PreparingCard t={t} />
        )}

        {isTranslating && <TranslatingCard t={t} />}

        {isSucceeded && (
          <SuccessCard
            file={file}
            jobData={jobData}
            srcLang={srcLang}
            tgtLang={tgtLang}
            onDownload={onDownload}
            isDownloading={isDownloading}
            t={t}
            tLang={tLang}
          />
        )}

        {isFailed && <FailedCard error={error} jobError={jobData?.error} t={t} />}
      </div>

      {/* Bottom actions */}
      <BottomBar flowStatus={flowStatus} jobStatus={jobStatus} onReset={onReset} t={t} />
    </div>
  )
}
