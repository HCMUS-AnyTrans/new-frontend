"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import {
  Key,
  Check,
  Link as LinkIcon,
  Unlink,
  Loader2,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  useLinkIdentity,
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
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export function SecurityTab() {
  const t = useTranslations("settings.security")
  const tCommon = useTranslations("common")
  const searchParams = useSearchParams()

  // Data hooks
  const { identities, isLoading: isLoadingIdentities } = useIdentities()
  const { unlinkIdentity, isUnlinking } = useUnlinkIdentity()
  const { linkIdentity, isLinking } = useLinkIdentity()
  const { changePassword, isChanging, isError: isPasswordError, error: passwordError, reset: resetPassword } = useChangePassword()

  // Local state
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [passwordForm, setPasswordForm] = useState<ChangePasswordDto>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Handle ?linked=google callback after OAuth redirect
  const [linkSuccess, setLinkSuccess] = useState<string | null>(null)
  useEffect(() => {
    const linked = searchParams.get("linked")
    if (linked) {
      setLinkSuccess(linked)
      // Clean up the URL query param without a full page reload
      const url = new URL(window.location.href)
      url.searchParams.delete("linked")
      window.history.replaceState({}, "", url.toString())
    }
  }, [searchParams])

  const isLoading = isLoadingIdentities

  // Show skeleton while loading
  if (isLoading) {
    return <SecurityTabSkeleton />
  }

  const linkedProviders = (identities ?? []).map((i) => i.provider)

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
      {/* Link success banner */}
      {linkSuccess && (
        <Alert className="border-success bg-success/10 text-success [&>svg]:text-success">
          <CheckCircle className="size-4" />
          <AlertDescription>
            {t("linkSuccess", { provider: linkSuccess.charAt(0).toUpperCase() + linkSuccess.slice(1) })}
          </AlertDescription>
        </Alert>
      )}

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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => linkIdentity(provider.id)}
                      disabled={isLinking}
                    >
                      {isLinking ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <LinkIcon className="size-4" />
                      )}
                      {t("link")}
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
