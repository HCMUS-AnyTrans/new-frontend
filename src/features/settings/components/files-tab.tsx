"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"
import {
  FileText,
  File,
  Presentation,
  Download,
  Trash2,
  AlertTriangle,
  FolderOpen,
  Loader2,
  FileDown,
  FileInput,
  ArrowRight,
  Coins,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { SettingsSection, SettingsDivider } from "./settings-section"
import { Pagination } from "@/components/ui/pagination"
import { useDeleteFilesByJob, useStorageUsage } from "../hooks/use-files"
import { useRecentJobs } from "@/features/dashboard/hooks"
import { getFileDownloadUrl } from "@/features/documents/api/documents.api"
import { jobStatusConfig } from "@/features/dashboard/data"
import type { TranslationJobResponse, TranslationJobFile } from "@/features/dashboard/api/dashboard.api"

// ============================================================================
// Helpers
// ============================================================================

function getFileIcon(name: string, className = "size-5") {
  const ext = name.split(".").pop()?.toLowerCase()
  if (ext === "pdf") return <FileText className={`${className} text-destructive`} />
  if (ext === "pptx" || ext === "ppt") return <Presentation className={`${className} text-warning`} />
  return <File className={`${className} text-primary`} />
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getDaysUntilExpiry(storeUntil: string): number {
  return Math.ceil((new Date(storeUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

async function triggerDownload(fileId: string, fileName: string) {
  const { download_url } = await getFileDownloadUrl(fileId)
  const a = document.createElement("a")
  a.href = download_url
  a.download = fileName
  a.target = "_blank"
  a.rel = "noopener noreferrer"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

// ============================================================================
// Skeleton Loading State
// ============================================================================

function FilesTabSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <Skeleton className="mb-4 h-5 w-28" />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <Skeleton className="mb-1 h-5 w-20" />
        <Skeleton className="mb-4 h-4 w-40" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start justify-between gap-3 py-3">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Skeleton className="size-8" />
                <Skeleton className="size-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// File Row Download Button
// ============================================================================

function DownloadFilesButton({ job, t }: { job: TranslationJobResponse; t: ReturnType<typeof useTranslations> }) {
  const [loadingOriginal, setLoadingOriginal] = useState(false)
  const [loadingTranslated, setLoadingTranslated] = useState(false)

  const isLoading = loadingOriginal || loadingTranslated
  const hasInput = !!job.input_file?.id
  const hasOutput = !!job.output_file?.id
  const inputExpired = job.input_file?.is_expired ?? false
  const outputExpired = job.output_file?.is_expired ?? false

  const handleDownloadOriginal = useCallback(async () => {
    if (!hasInput || loadingOriginal) return
    setLoadingOriginal(true)
    try { await triggerDownload(job.input_file!.id, job.input_file!.name) }
    finally { setLoadingOriginal(false) }
  }, [hasInput, loadingOriginal, job.input_file])

  const handleDownloadTranslated = useCallback(async () => {
    if (!hasOutput || outputExpired || loadingTranslated) return
    setLoadingTranslated(true)
    try { await triggerDownload(job.output_file!.id, job.output_file!.name) }
    finally { setLoadingTranslated(false) }
  }, [hasOutput, outputExpired, loadingTranslated, job.output_file])

  if (!hasInput && !hasOutput) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" disabled={isLoading}>
          {isLoading
            ? <Loader2 className="size-4 animate-spin text-muted-foreground" />
            : <Download className="size-4 text-muted-foreground" />
          }
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          {t("download")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Original */}
        {hasInput && (
          inputExpired ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <DropdownMenuItem disabled className="cursor-not-allowed gap-2 opacity-50">
                      <FileInput className="size-4 shrink-0" />
                      <div className="flex flex-col">
                        <span>{t("downloadOriginal")}</span>
                        <span className="text-xs text-muted-foreground">{t("fileExpired")}</span>
                      </div>
                    </DropdownMenuItem>
                  </span>
                </TooltipTrigger>
                <TooltipContent side="left">{t("fileExpired")}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <DropdownMenuItem className="gap-2" onClick={handleDownloadOriginal} disabled={loadingOriginal}>
              <FileInput className="size-4 shrink-0 text-muted-foreground" />
              <div className="flex min-w-0 flex-col">
                <span>{t("downloadOriginal")}</span>
                <span className="truncate text-xs text-muted-foreground">{job.input_file!.name}</span>
              </div>
            </DropdownMenuItem>
          )
        )}

        {/* Translated */}
        {hasOutput && (
          outputExpired ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <DropdownMenuItem disabled className="cursor-not-allowed gap-2 opacity-50">
                      <FileDown className="size-4 shrink-0" />
                      <div className="flex flex-col">
                        <span>{t("downloadTranslated")}</span>
                        <span className="text-xs text-muted-foreground">{t("fileExpired")}</span>
                      </div>
                    </DropdownMenuItem>
                  </span>
                </TooltipTrigger>
                <TooltipContent side="left">{t("fileExpired")}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <DropdownMenuItem className="gap-2" onClick={handleDownloadTranslated} disabled={loadingTranslated}>
              <FileDown className="size-4 shrink-0 text-primary" />
              <div className="flex min-w-0 flex-col">
                <span>{t("downloadTranslated")}</span>
                <span className="truncate text-xs text-muted-foreground">{job.output_file!.name}</span>
              </div>
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ============================================================================
// Job Row (one translation = two files)
// ============================================================================

function FileExpiryInfo({ file, t, locale }: { file: TranslationJobFile; t: ReturnType<typeof useTranslations>; locale: string }) {
  if (file.is_expired) {
    return <span className="flex items-center gap-1 text-destructive/70">{t("fileExpired")}</span>
  }
  const days = getDaysUntilExpiry(file.store_until)
  if (days <= 3) {
    return (
      <span className="flex items-center gap-1 text-warning">
        <AlertTriangle className="size-3" />
        {t("daysRemaining", { count: days })}
      </span>
    )
  }
  return (
    <span>
      {t("expiresOn", {
        date: new Date(file.store_until).toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      })}
    </span>
  )
}

// ============================================================================
// Main Component
// ============================================================================

const ITEMS_PER_PAGE = 10

export function FilesTab() {
  const t = useTranslations("settings.files")
  const tCommon = useTranslations("common")
  const tStatus = useTranslations("dashboard.status")
  const locale = useLocale()

  // Pagination
  const [page, setPage] = useState(1)

  // Data — use same translations API as history page
  const { jobsData, isLoading: isLoadingJobs, isFetching } = useRecentJobs({ page, limit: ITEMS_PER_PAGE })
  const { storage, isLoading: isLoadingStorage } = useStorageUsage()
  const { deleteFilesByJob, isDeleting } = useDeleteFilesByJob()

  // Delete confirmation state
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; job: TranslationJobResponse | null }>({
    open: false,
    job: null,
  })

  const isLoading = isLoadingJobs || isLoadingStorage

  if (isLoading) {
    return <FilesTabSkeleton />
  }

  const jobs = jobsData?.data ?? []
  const meta = jobsData?.meta
  const usagePercent = storage?.percentage ?? 0

  const handleDeleteClick = (job: TranslationJobResponse) => {
    setDeleteDialog({ open: true, job })
  }

  const confirmDelete = () => {
    if (deleteDialog.job) {
      deleteFilesByJob(deleteDialog.job.job_id)
      setDeleteDialog({ open: false, job: null })
    }
  }

  return (
    <div className="space-y-6">
      {/* Storage Usage */}
      <SettingsSection title={t("storageUsage")}>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {storage ? `${storage.used} / ${storage.total} ${storage.unit}` : "— / —"}
            </span>
            <span className="font-medium text-foreground">{usagePercent.toFixed(1)}%</span>
          </div>
          <Progress value={usagePercent} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {t("filesStored", { count: storage?.fileCount ?? 0 })}
          </p>
        </div>
      </SettingsSection>

      {/* Translation File List */}
      <SettingsSection title={t("yourFiles")} description={t("yourFilesDescription")}>
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
            <FolderOpen className="mb-3 size-10" />
            <p className="text-sm font-medium text-foreground">{t("noTranslationFiles")}</p>
            <p className="mt-1 text-sm">{t("noTranslationFilesDescription")}</p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href="/documents">{t("startTranslating")}</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-1">
            {jobs.map((job, idx) => {
              const fileName = job.input_file?.name ?? job.job_id
              const statusCfg = jobStatusConfig[job.status]
              const hasInputFile = !!job.input_file
              const hasOutputFile = !!job.output_file

              return (
                <div key={job.job_id}>
                  {idx > 0 && <SettingsDivider />}
                  <div className="flex items-start justify-between gap-3 py-2">
                    {/* Left: icon + info */}
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        {getFileIcon(fileName)}
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        {/* File name + status */}
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-medium text-foreground">
                            {fileName}
                          </p>
                          <Badge variant="outline" className={`shrink-0 text-xs ${statusCfg?.className ?? ""}`}>
                            {tStatus(job.status)}
                          </Badge>
                        </div>

                        {/* Languages + cost */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            {job.src_lang}
                            <ArrowRight className="size-3" />
                            {job.tgt_lang}
                          </span>
                          {job.cost_credits !== undefined && (
                            <>
                              <span>&bull;</span>
                              <span className="flex items-center gap-1">
                                <Coins className="size-3 text-warning" />
                                {job.cost_credits}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Original file info */}
                        {hasInputFile && (
                          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">{t("originalFile")}:</span>
                            <span>{formatFileSize(job.input_file!.size_bytes)}</span>
                            <span>&bull;</span>
                            <FileExpiryInfo file={job.input_file!} t={t} locale={locale} />
                          </div>
                        )}

                        {/* Translated file info */}
                        {hasOutputFile && (
                          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">{t("translatedFile")}:</span>
                            <span>{formatFileSize(job.output_file!.size_bytes)}</span>
                            <span>&bull;</span>
                            <FileExpiryInfo file={job.output_file!} t={t} locale={locale} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: actions */}
                    <div className="flex shrink-0 items-center gap-1">
                      <DownloadFilesButton job={job} t={t} />
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDeleteClick(job)}
                        className="text-muted-foreground hover:text-destructive"
                        disabled={isDeleting}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {meta && (
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            hasNext={meta.hasNext}
            hasPrev={meta.hasPrev}
            onPageChange={setPage}
            isFetching={isFetching}
          />
        )}
      </SettingsSection>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, job: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("confirmDeleteJob")}</DialogTitle>
            <DialogDescription>
              {t("confirmDeleteJobMessage", {
                name: deleteDialog.job?.input_file?.name ?? deleteDialog.job?.job_id ?? "",
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, job: null })}
            >
              {tCommon("cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting && <Loader2 className="mr-2 size-4 animate-spin" />}
              {tCommon("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
