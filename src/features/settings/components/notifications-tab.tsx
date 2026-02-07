"use client"

import { useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { Bell, Mail, Smartphone, Check, CheckCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { SettingsSection, SettingsRow, SettingsDivider } from "./settings-section"
import { mockNotifications, mockNotificationPreferences } from "../data"
import type { Notification, NotificationPreference, NotificationType } from "../types"
import { cn } from "@/lib/utils"

const notificationTypeIcons: Record<NotificationType, string> = {
  translation_complete: "📄",
  credit_purchase: "💳",
  file_expiring: "⚠️",
  security_alert: "🔒",
  promotion: "🎁",
  system: "ℹ️",
}

interface NotificationsTabProps {
  notifications?: Notification[]
  preferences?: NotificationPreference[]
}

export function NotificationsTab({
  notifications = mockNotifications,
  preferences = mockNotificationPreferences,
}: NotificationsTabProps) {
  const t = useTranslations("settings.notifications")
  const tSecurity = useTranslations("settings.security")
  const locale = useLocale()
  const [notifList, setNotifList] = useState(notifications)
  const [prefList, setPrefList] = useState(preferences)

  const unreadCount = notifList.filter((n) => !n.read).length

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

  const markAllAsRead = () => {
    setNotifList(notifList.map((n) => ({ ...n, read: true })))
  }

  const toggleRead = (id: string) => {
    setNotifList(
      notifList.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    )
  }

  const updatePref = (
    type: NotificationType,
    field: "emailEnabled" | "pushEnabled",
    value: boolean
  ) => {
    setPrefList(
      prefList.map((p) => (p.type === type ? { ...p, [field]: value } : p))
    )
  }

  return (
    <div className="space-y-6">
      {/* Notification List */}
      <SettingsSection
        title={t("recentNotifications")}
        description={unreadCount > 0 ? t("unreadCount", { count: unreadCount }) : t("allRead")}
        action={
          unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="size-4" />
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
                  onClick={() => toggleRead(notif.id)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-lg p-2 text-left transition-colors hover:bg-muted/50",
                    !notif.read && "bg-primary/5"
                  )}
                >
                  <span className="mt-0.5 text-lg">
                    {notificationTypeIcons[notif.type]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={cn("text-sm", !notif.read && "font-medium")}>
                        {notif.title}
                      </p>
                      {!notif.read && (
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
                    onCheckedChange={(v) => updatePref(pref.type, "emailEnabled", v)}
                  />
                  <Switch
                    checked={pref.pushEnabled}
                    onCheckedChange={(v) => updatePref(pref.type, "pushEnabled", v)}
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
