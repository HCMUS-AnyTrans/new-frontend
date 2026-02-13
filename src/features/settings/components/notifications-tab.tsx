"use client"

import { useTranslations, useLocale } from "next-intl"
import { Bell, Mail, Smartphone, CheckCheck, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { SettingsSection, SettingsDivider } from "./settings-section"
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useNotificationPreferences,
  useUpdateNotificationPreferences,
} from "../hooks/use-notifications"
import type { NotificationType } from "../types"
import { cn } from "@/lib/utils"

const notificationTypeIcons: Record<NotificationType, string> = {
  translation_complete: "\u{1F4C4}",
  credit_purchase: "\u{1F4B3}",
  file_expiring: "\u26A0\uFE0F",
  security_alert: "\u{1F512}",
  promotion: "\u{1F381}",
  system: "\u2139\uFE0F",
}

// ============================================================================
// Skeleton Loading State
// ============================================================================

function NotificationsTabSkeleton() {
  return (
    <div className="space-y-6">
      {/* Notification List Skeleton */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Skeleton className="mb-1 h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-8 w-28" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-3 p-2">
              <Skeleton className="mt-0.5 size-6 rounded" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-64" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preferences Skeleton */}
      <div className="rounded-lg border bg-card p-6">
        <Skeleton className="mb-1 h-5 w-24" />
        <Skeleton className="mb-4 h-4 w-48" />
        <div className="mb-4 flex items-center justify-end gap-8">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="space-y-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-48" />
              </div>
              <div className="flex items-center gap-8">
                <Skeleton className="h-5 w-9" />
                <Skeleton className="h-5 w-9" />
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

export function NotificationsTab() {
  const t = useTranslations("settings.notifications")
  const tSecurity = useTranslations("settings.security")
  const locale = useLocale()

  // Data hooks
  const { notifications, unreadCount, isLoading: isLoadingNotifs } = useNotifications()
  const { markRead } = useMarkNotificationRead()
  const { markAllRead, isMarking: isMarkingAll } = useMarkAllNotificationsRead()
  const { preferences, isLoading: isLoadingPrefs } = useNotificationPreferences()
  const { updatePreferences, isUpdating } = useUpdateNotificationPreferences()

  const isLoading = isLoadingNotifs || isLoadingPrefs

  // Show skeleton while loading
  if (isLoading) {
    return <NotificationsTabSkeleton />
  }

  const notifList = notifications ?? []
  const prefList = preferences ?? []

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return tSecurity("justNow")
    if (diffMins < 60) return tSecurity("minutesAgo", { count: diffMins })
    if (diffHours < 24) return tSecurity("hoursAgo", { count: diffHours })
    if (diffDays < 7) return tSecurity("daysAgo", { count: diffDays })
    return date.toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US")
  }

  const handleMarkAllAsRead = () => {
    markAllRead()
  }

  const handleToggleRead = (id: string) => {
    markRead(id)
  }

  const handleUpdatePref = (
    type: NotificationType,
    field: "emailEnabled" | "pushEnabled",
    value: boolean
  ) => {
    const updated = prefList.map((p) =>
      p.type === type ? { ...p, [field]: value } : p
    )
    updatePreferences({
      preferences: updated.map((p) => ({
        type: p.type,
        emailEnabled: p.emailEnabled,
        pushEnabled: p.pushEnabled,
      })),
    })
  }

  return (
    <div className="space-y-6">
      {/* Notification List */}
      <SettingsSection
        title={t("recentNotifications")}
        description={unreadCount > 0 ? t("unreadCount", { count: unreadCount }) : t("allRead")}
        action={
          unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} disabled={isMarkingAll}>
              {isMarkingAll ? (
                <Loader2 className="mr-1 size-4 animate-spin" />
              ) : (
                <CheckCheck className="size-4" />
              )}
              {t("markAllRead")}
            </Button>
          )
        }
      >
        {notifList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Bell className="mb-2 size-8" />
            <p>{t("noNotifications")}</p>
          </div>
        ) : (
          <div className="space-y-1">
            {notifList.slice(0, 5).map((notif, idx) => (
              <div key={notif.id}>
                {idx > 0 && <SettingsDivider />}
                <button
                  onClick={() => handleToggleRead(notif.id)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-lg p-2 text-left transition-colors hover:bg-muted/50",
                    !notif.isRead && "bg-primary/5"
                  )}
                >
                  <span className="mt-0.5 text-lg">
                    {notificationTypeIcons[notif.type]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={cn("text-sm", !notif.isRead && "font-medium")}>
                        {notif.title}
                      </p>
                      {!notif.isRead && (
                        <span className="size-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {notif.message}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(notif.createdAt)}
                    </p>
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
      </SettingsSection>

      {/* Notification Preferences */}
      <SettingsSection
        title={t("preferences")}
        description={t("preferencesDescription")}
      >
        <div className="space-y-1">
          {/* Header */}
          <div className="mb-4 flex items-center justify-end gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Mail className="size-4" />
              <span>{t("email")}</span>
            </div>
            <div className="flex items-center gap-1">
              <Smartphone className="size-4" />
              <span>{t("push")}</span>
            </div>
          </div>

          {prefList.map((pref, idx) => (
            <div key={pref.type}>
              {idx > 0 && <SettingsDivider />}
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-foreground">{pref.label}</p>
                  <p className="text-sm text-muted-foreground">{pref.description}</p>
                </div>
                <div className="flex items-center gap-8">
                  <Switch
                    checked={pref.emailEnabled}
                    onCheckedChange={(v) => handleUpdatePref(pref.type, "emailEnabled", v)}
                    disabled={isUpdating}
                  />
                  <Switch
                    checked={pref.pushEnabled}
                    onCheckedChange={(v) => handleUpdatePref(pref.type, "pushEnabled", v)}
                    disabled={isUpdating}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </SettingsSection>
    </div>
  )
}
