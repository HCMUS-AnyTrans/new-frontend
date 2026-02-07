"use client"

import { useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import {
  FileText,
  Download,
  Trash2,
  AlertTriangle,
  FolderOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SettingsSection, SettingsDivider } from "./settings-section"
import { mockUserFiles, mockStorageUsage } from "../data"
import type { UserFile, StorageUsage, FileType } from "../types"
import { cn } from "@/lib/utils"

const fileTypeIcons: Record<FileType, { color: string; label: string }> = {
  pdf: { color: "text-destructive", label: "PDF" },
  docx: { color: "text-primary", label: "DOCX" },
  pptx: { color: "text-warning", label: "PPTX" },
  txt: { color: "text-muted-foreground", label: "TXT" },
  srt: { color: "text-success", label: "SRT" },
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

function getDaysUntilExpiry(expiresAt: string): number {
  const now = new Date()
  const expiry = new Date(expiresAt)
  return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

interface FilesTabProps {
  files?: UserFile[]
  storage?: StorageUsage
}

export function FilesTab({
  files = mockUserFiles,
  storage = mockStorageUsage,
}: FilesTabProps) {
  const t = useTranslations("settings.files")
  const tCommon = useTranslations("common")
  const locale = useLocale()
  const [fileList, setFileList] = useState(files)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; file: UserFile | null }>({
    open: false,
    file: null,
  })

  const usagePercent = (storage.used / storage.total) * 100

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const handleDownload = (file: UserFile) => {
    // TODO: Call API to get download URL
    console.log("Download file:", file.name)
  }

  const handleDelete = (file: UserFile) => {
    setDeleteDialog({ open: true, file })
  }

  const confirmDelete = () => {
    if (deleteDialog.file) {
      setFileList(fileList.filter((f) => f.id !== deleteDialog.file?.id))
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
              {formatFileSize(storage.used)} / {formatFileSize(storage.total)}
            </span>
            <span className="font-medium text-foreground">
              {usagePercent.toFixed(1)}%
            </span>
          </div>
          <Progress value={usagePercent} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {t("filesStored", { count: storage.fileCount })}
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
              const typeConfig = fileTypeIcons[file.type]
              const daysUntilExpiry = getDaysUntilExpiry(file.expiresAt)
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
                          <span>{formatFileSize(file.size)}</span>
                          <span>•</span>
                          {isExpiringSoon ? (
                            <span className="flex items-center gap-1 text-warning">
                              <AlertTriangle className="size-3" />
                              {t("daysRemaining", { count: daysUntilExpiry })}
                            </span>
                          ) : (
                            <span>{t("expiresOn", { date: formatDate(file.expiresAt) })}</span>
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
                      >
                        <Download className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(file)}
                        className="text-muted-foreground hover:text-destructive"
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
            <Button variant="destructive" onClick={confirmDelete}>
              {tCommon("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
