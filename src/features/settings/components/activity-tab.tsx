"use client"

import { useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { History, Monitor, Smartphone } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { SettingsSection, SettingsDivider } from "./settings-section"
import { Pagination } from "@/components/ui/pagination"
import { useActivity } from "../hooks/use-activity"
import type { AuditAction } from "../types"
import { cn } from "@/lib/utils"

// ============================================================================
// Skeleton Loading State
// ============================================================================

function ActivityTabSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6">
          <div className="mb-4">
            <Skeleton className="mb-1 h-5 w-24" />
            <Skeleton className="h-4 w-40" />
          </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start gap-3 py-3">
              <Skeleton className="mt-0.5 size-9 rounded-lg" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-4 w-44" />
                </div>
                <Skeleton className="h-3 w-64" />
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

export function ActivityTab() {
  const t = useTranslations("settings.activity")
  const locale = useLocale()

  // Pagination state
  const [page, setPage] = useState(1)

  // Data hooks
  const { logs, pagination: activityPagination, isLoading, isFetching: isFetchingActivity } = useActivity({ page, limit: 10 })

  // Show skeleton while loading
  if (isLoading) {
    return <ActivityTabSkeleton />
  }

  const actionConfig: Record<AuditAction, { label: string; color: string }> = {
    login: { label: t("login"), color: "bg-success/10 text-success" },
    logout: { label: t("logout"), color: "bg-muted text-muted-foreground" },
    password_change: { label: t("passwordChange"), color: "bg-warning/10 text-warning" },
    profile_update: { label: t("profileUpdate"), color: "bg-primary/10 text-primary" },
    provider_link: { label: t("providerLink"), color: "bg-info/10 text-info" },
    provider_unlink: { label: t("providerUnlink"), color: "bg-warning/10 text-warning" },
    session_revoke: { label: t("sessionRevoke"), color: "bg-destructive/10 text-destructive" },
    file_upload: { label: t("fileUpload"), color: "bg-primary/10 text-primary" },
    file_delete: { label: t("fileDelete"), color: "bg-destructive/10 text-destructive" },
    translation_start: { label: t("translationStart"), color: "bg-primary/10 text-primary" },
    translation_complete: { label: t("translationComplete"), color: "bg-success/10 text-success" },
    credit_purchase: { label: t("creditPurchase"), color: "bg-success/10 text-success" },
    settings_change: { label: t("settingsChange"), color: "bg-muted text-muted-foreground" },
  }

  function formatDateTime(dateStr: string): string {
    return new Date(dateStr).toLocaleString(locale === "vi" ? "vi-VN" : "en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const logList = logs ?? []

  const getDeviceIcon = (device?: string) => {
    return device?.toLowerCase().includes("mobile") ? Smartphone : Monitor
  }

  return (
    <div className="space-y-6">
      {/* Activity Log */}
      <SettingsSection
        title={t("title")}
        description={t("description")}
      >
        {logList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <History className="mb-2 size-8" />
            <p>{t("noActivity")}</p>
          </div>
        ) : (
          <div className="space-y-1">
            {logList.map((log, idx) => {
              const config = actionConfig[log.action as AuditAction] || {
                label: log.action,
                color: "bg-muted text-muted-foreground",
              }
              const DeviceIcon = getDeviceIcon(log.device)

              return (
                <div key={log.id}>
                  {idx > 0 && <SettingsDivider />}
                  <div className="flex items-start justify-between gap-4 py-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <DeviceIcon className="size-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className={cn("text-xs", config.color)} variant="secondary">
                            {config.label}
                          </Badge>
                          <span className="text-sm text-foreground">
                            {log.description}
                          </span>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <span>{formatDateTime(log.createdAt)}</span>
                          {log.browser && (
                            <>
                              <span>&bull;</span>
                              <span>{log.browser}</span>
                            </>
                          )}
                          <span>&bull;</span>
                          <span>{log.ip}</span>
                          {log.location && (
                            <>
                              <span>&bull;</span>
                              <span>{log.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Activity Pagination */}
        {activityPagination && (
          <Pagination
            page={activityPagination.page}
            totalPages={activityPagination.totalPages}
            hasNext={activityPagination.hasNext}
            hasPrev={activityPagination.hasPrev}
            onPageChange={setPage}
            isFetching={isFetchingActivity}
          />
        )}
      </SettingsSection>
    </div>
  )
}
