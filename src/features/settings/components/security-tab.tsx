"use client"

import { useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import {
  Key,
  Smartphone,
  Monitor,
  LogOut,
  Check,
  Link as LinkIcon,
  Unlink,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SettingsSection, SettingsDivider } from "./settings-section"
import { authProviderOptions } from "../data"
import {
  useIdentities,
  useUnlinkIdentity,
  useSessions,
  useRevokeSession,
  useRevokeAllSessions,
  useChangePassword,
} from "../hooks/use-security"
import type { AuthProvider, ChangePasswordDto } from "../types"

// ============================================================================
// Skeleton Loading State
// ============================================================================

function SecurityTabSkeleton() {
  return (
    <div className="space-y-6">
      {/* Password Skeleton */}
      <div className="rounded-lg border bg-card p-6">
        <Skeleton className="mb-1 h-5 w-20" />
        <Skeleton className="mb-4 h-4 w-40" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-lg" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      {/* OAuth Skeleton */}
      <div className="rounded-lg border bg-card p-6">
        <Skeleton className="mb-1 h-5 w-32" />
        <Skeleton className="mb-4 h-4 w-48" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Sessions Skeleton */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Skeleton className="mb-1 h-5 w-28" />
            <Skeleton className="h-4 w-44" />
          </div>
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-44" />
                </div>
              </div>
              <Skeleton className="h-8 w-20" />
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

export function SecurityTab() {
  const t = useTranslations("settings.security")
  const tCommon = useTranslations("common")
  const locale = useLocale()

  // Data hooks
  const { identities, isLoading: isLoadingIdentities } = useIdentities()
  const { unlinkIdentity, isUnlinking } = useUnlinkIdentity()
  const { sessions, isLoading: isLoadingSessions } = useSessions()
  const { revokeSession, isRevoking: isRevokingSession } = useRevokeSession()
  const { revokeAllSessions, isRevoking: isRevokingAll } = useRevokeAllSessions()
  const { changePassword, isChanging, isError: isPasswordError, error: passwordError, reset: resetPassword } = useChangePassword()

  // Local state
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [passwordForm, setPasswordForm] = useState<ChangePasswordDto>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const isLoading = isLoadingIdentities || isLoadingSessions

  // Show skeleton while loading
  if (isLoading) {
    return <SecurityTabSkeleton />
  }

  const linkedProviders = (identities ?? []).map((i) => i.provider)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return t("justNow")
    if (diffMins < 60) return t("minutesAgo", { count: diffMins })
    if (diffHours < 24) return t("hoursAgo", { count: diffHours })
    if (diffDays < 7) return t("daysAgo", { count: diffDays })
    return date.toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US")
  }

  const getDeviceIcon = (device: string) => {
    return device.toLowerCase().includes("mobile") ? Smartphone : Monitor
  }

  const handleChangePassword = () => {
    changePassword(passwordForm, {
      onSuccess: () => {
        setShowPasswordDialog(false)
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
        resetPassword()
      },
    })
  }

  const handleOpenPasswordDialog = (open: boolean) => {
    setShowPasswordDialog(open)
    if (!open) {
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
      resetPassword()
    }
  }

  return (
    <div className="space-y-6">
      {/* Password Section */}
      <SettingsSection
        title={t("password")}
        description={t("passwordDescription")}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
              <Key className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">••••••••••</p>
              <p className="text-sm text-muted-foreground">
                {t("lastChanged", { time: t("daysAgo", { count: 30 }) })}
              </p>
            </div>
          </div>

          <Dialog open={showPasswordDialog} onOpenChange={handleOpenPasswordDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">{t("changePassword")}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("changePassword")}</DialogTitle>
                <DialogDescription>
                  {t("enterCurrentAndNew")}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="current">{t("currentPassword")}</Label>
                  <Input
                    id="current"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">{t("newPassword")}</Label>
                  <Input
                    id="new"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">{t("confirmPassword")}</Label>
                  <Input
                    id="confirm"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                  />
                </div>
                {isPasswordError && (
                  <p className="text-sm text-destructive">
                    {(passwordError as Error)?.message || t("changePasswordError")}
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => handleOpenPasswordDialog(false)}>
                  {tCommon("cancel")}
                </Button>
                <Button onClick={handleChangePassword} disabled={isChanging}>
                  {isChanging ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      {t("changePassword")}
                    </>
                  ) : (
                    t("changePassword")
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </SettingsSection>

      {/* OAuth Providers */}
      <SettingsSection
        title={t("loginMethods")}
        description={t("loginMethodsDescription")}
      >
        <div className="space-y-1">
          {authProviderOptions.map((provider, idx) => {
            const isLinked = linkedProviders.includes(provider.id as AuthProvider)
            const identity = (identities ?? []).find((i) => i.provider === provider.id)

            return (
              <div key={provider.id}>
                {idx > 0 && <SettingsDivider />}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex size-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${provider.color}15` }}
                    >
                      <span className="text-lg font-bold" style={{ color: provider.color }}>
                        {provider.name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{provider.name}</p>
                      {isLinked && identity?.email && (
                        <p className="text-sm text-muted-foreground">{identity.email}</p>
                      )}
                    </div>
                  </div>

                  {isLinked ? (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="gap-1">
                        <Check className="size-3" />
                        {t("linked")}
                      </Badge>
                      {identity?.canUnlink && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                          onClick={() => identity && unlinkIdentity(identity.id)}
                          disabled={isUnlinking}
                        >
                          <Unlink className="size-4" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Button variant="outline" size="sm">
                      <LinkIcon className="size-4" />
                      {t("link")}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </SettingsSection>

      {/* Active Sessions */}
      <SettingsSection
        title={t("activeSessions")}
        description={t("activeSessionsDescription")}
        action={
          (sessions ?? []).length > 1 && (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive"
              onClick={() => revokeAllSessions()}
              disabled={isRevokingAll}
            >
              {isRevokingAll ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : null}
              {t("revokeAllSessions")}
            </Button>
          )
        }
      >
        <div className="space-y-1">
          {(sessions ?? []).map((session, idx) => {
            const DeviceIcon = getDeviceIcon(session.device)
            return (
              <div key={session.id}>
                {idx > 0 && <SettingsDivider />}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                      <DeviceIcon className="size-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">
                          {session.browser} - {session.os}
                        </p>
                        {session.isCurrent && (
                          <Badge variant="secondary" className="text-xs">
                            {t("currentDevice")}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {session.location} • {formatDate(session.lastActiveAt)}
                      </p>
                    </div>
                  </div>

                  {!session.isCurrent && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => revokeSession(session.id)}
                      disabled={isRevokingSession}
                    >
                      <LogOut className="size-4" />
                      {t("revokeSession")}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </SettingsSection>
    </div>
  )
}
