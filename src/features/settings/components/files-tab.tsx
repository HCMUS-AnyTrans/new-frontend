"use client"

import { useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import {
  FileText,
  Download,
  Trash2,
  AlertTriangle,
  FolderOpen,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SettingsSection, SettingsDivider } from "./settings-section"
import { Pagination } from "@/components/ui/pagination"
import { useFiles, useFileDownload, useDeleteFile, useStorageUsage } from "../hooks/use-files"
import type { UserFile } from "../types"
import { cn } from "@/lib/utils"

const mimeTypeConfig: Record<string, { color: string; label: string }> = {
  "application/pdf": { color: "text-destructive", label: "PDF" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { color: "text-primary", label: "DOCX" },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": { color: "text-warning", label: "PPTX" },
  "text/plain": { color: "text-muted-foreground", label: "TXT" },
}

function getFileTypeConfig(mime: string) {
  return mimeTypeConfig[mime] ?? { color: "text-muted-foreground", label: mime.split("/").pop()?.toUpperCase() ?? "FILE" }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

function getDaysUntilExpiry(storeUntil: string): number {
  const now = new Date()
  const expiry = new Date(storeUntil)
  return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

// ============================================================================
// Skeleton Loading State
// ============================================================================

function FilesTabSkeleton() {
  return (
    <div className="space-y-6">
      {/* Storage Usage Skeleton */}
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

      {/* File List Skeleton */}
      <div className="rounded-lg border bg-card p-6">
        <Skeleton className="mb-1 h-5 w-20" />
        <Skeleton className="mb-4 h-4 w-40" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-lg" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                  <Skeleton className="h-3 w-48" />
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
// Main Component
// ============================================================================

export function FilesTab() {
  const t = useTranslations("settings.files")
  const tCommon = useTranslations("common")
  const locale = useLocale()

  // Pagination state
  const [page, setPage] = useState(1)

  // Data hooks
  const { files, pagination: filesPagination, isLoading: isLoadingFiles, isFetching: isFetchingFiles } = useFiles({ page, limit: 10 })
  const { storage, isLoading: isLoadingStorage } = useStorageUsage()
  const { download, isDownloading } = useFileDownload()
  const { deleteFile, isDeleting } = useDeleteFile()

  // Local state
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; file: UserFile | null }>({
    open: false,
    file: null,
  })

  const isLoading = isLoadingFiles || isLoadingStorage

  // Show skeleton while loading
  if (isLoading) {
    return <FilesTabSkeleton />
  }

  const fileList = files ?? []
  const usagePercent = storage?.percentage ?? 0

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const handleDownload = (file: UserFile) => {
    download(file.id)
  }

  const handleDelete = (file: UserFile) => {
    setDeleteDialog({ open: true, file })
  }

  const confirmDelete = () => {
    if (deleteDialog.file) {
      deleteFile(deleteDialog.file.id)
      setDeleteDialog({ open: false, file: null })
    }
  }

  return (
    <div className="space-y-6">
      {/* Storage Usage */}
      <SettingsSection title={t("storageUsage")}>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {storage ? `${storage.used} / ${storage.total} ${storage.unit}` : "- / -"}
            </span>
            <span className="font-medium text-foreground">
              {usagePercent.toFixed(1)}%
            </span>
          </div>
          <Progress value={usagePercent} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {t("filesStored", { count: storage?.fileCount ?? 0 })}
          </p>
        </div>
      </SettingsSection>

      {/* File List */}
      <SettingsSection
        title={t("yourFiles")}
        description={t("yourFilesDescription")}
      >
        {fileList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <FolderOpen className="mb-2 size-8" />
            <p>{t("noFiles")}</p>
          </div>
        ) : (
          <div className="space-y-1">
            {fileList.map((file, idx) => {
              const typeConfig = getFileTypeConfig(file.mime)
              const daysUntilExpiry = getDaysUntilExpiry(file.storeUntil)
              const isExpiringSoon = daysUntilExpiry <= 7

              return (
                <div key={file.id}>
                  {idx > 0 && <SettingsDivider />}
                  <div className="flex items-center justify-between py-2">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                        <FileText className={cn("size-5", typeConfig.color)} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium text-foreground">
                            {file.name}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {typeConfig.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{formatFileSize(file.sizeBytes)}</span>
                          <span>&bull;</span>
                          {isExpiringSoon ? (
                            <span className="flex items-center gap-1 text-warning">
                              <AlertTriangle className="size-3" />
                              {t("daysRemaining", { count: daysUntilExpiry })}
                            </span>
                          ) : (
                            <span>{t("expiresOn", { date: formatDate(file.storeUntil) })}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDownload(file)}
                        className="text-muted-foreground hover:text-foreground"
                        disabled={isDownloading}
                      >
                        {isDownloading ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Download className="size-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(file)}
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

        {/* Files Pagination */}
        {filesPagination && (
          <Pagination
            page={filesPagination.page}
            totalPages={filesPagination.totalPages}
            hasNext={filesPagination.hasNext}
            hasPrev={filesPagination.hasPrev}
            onPageChange={setPage}
            isFetching={isFetchingFiles}
          />
        )}
      </SettingsSection>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, file: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("confirmDelete")}</DialogTitle>
            <DialogDescription>
              {t("confirmDeleteMessage", { name: deleteDialog.file?.name || "" })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, file: null })}>
              {tCommon("cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : null}
              {tCommon("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
