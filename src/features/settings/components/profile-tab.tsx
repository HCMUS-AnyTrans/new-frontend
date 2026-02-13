"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Camera, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SettingsSection,
  SettingsRow,
  SettingsDivider,
} from "./settings-section";
import { useProfile } from "../hooks/use-profile";
import { useUpdateProfile } from "../hooks/use-update-profile";
import { useUploadAvatar } from "../hooks/use-upload-avatar";

// ============================================================================
// Skeleton Loading State
// ============================================================================

function ProfileTabSkeleton() {
  return (
    <div className="space-y-6">
      {/* Avatar Skeleton */}
      <div className="rounded-lg border bg-card p-6">
        <Skeleton className="mb-4 h-5 w-20" />
        <div className="flex items-center gap-6">
          <Skeleton className="size-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>

      {/* Personal Info Skeleton */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-8 w-16" />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="border-t" />
          <div className="flex items-center justify-between py-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="border-t" />
          <div className="flex items-center justify-between py-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
      </div>

      {/* Account Info Skeleton */}
      <div className="rounded-lg border bg-card p-6">
        <Skeleton className="mb-4 h-5 w-28" />
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-5 w-56" />
          </div>
          <div className="border-t" />
          <div className="flex items-center justify-between py-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-36" />
          </div>
          <div className="border-t" />
          <div className="flex items-center justify-between py-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function ProfileTab() {
  const t = useTranslations("settings.profile");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  // Data hooks
  const { profile, isLoading } = useProfile();
  const { updateProfile, isUpdating } = useUpdateProfile();
  const { uploadAvatar, isUploading } = useUploadAvatar();

  // Local state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName,
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  // Show skeleton while loading
  if (isLoading || !profile) {
    return <ProfileTabSkeleton />;
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSave = () => {
    updateProfile(
      {
        fullName: formData.fullName,
        phone: formData.phone || null,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleCancel = () => {
    setFormData({
      fullName: profile.fullName,
      phone: profile.phone || "",
    });
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        return;
      }
      uploadAvatar(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveAvatar = () => {
    updateProfile({ avatarUrl: "" });
  };

  const dateFormatter = new Intl.DateTimeFormat(
    locale === "vi" ? "vi-VN" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const dateTimeFormatter = new Intl.DateTimeFormat(
    locale === "vi" ? "vi-VN" : "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <SettingsSection title={t("avatar")}>
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="size-20">
              <AvatarImage
                src={profile.avatarUrl || undefined}
                alt={profile.fullName}
              />
              <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                {getInitials(profile.fullName)}
              </AvatarFallback>
            </Avatar>
            {isUploading ? (
              <div className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-sm">
                <Loader2 className="size-3.5 animate-spin" />
              </div>
            ) : (
              <button
                onClick={handleAvatarClick}
                className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                <Camera className="size-3.5" />
              </button>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAvatarClick}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    {t("changeAvatar")}
                  </>
                ) : (
                  t("changeAvatar")
                )}
              </Button>
              {profile.avatarUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={handleRemoveAvatar}
                  disabled={isUploading || isUpdating}
                >
                  <X className="size-4" />
                  {t("removeAvatar")}
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              JPG, PNG or GIF. Max 2MB.
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
      </SettingsSection>

      {/* Personal Info Section */}
      <SettingsSection
        title={t("title")}
        action={
          !isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              {tCommon("edit")}
            </Button>
          ) : null
        }
      >
        <div className="space-y-1">
          <SettingsRow label={t("fullName")}>
            {isEditing ? (
              <Input
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-64"
              />
            ) : (
              <span className="text-sm text-foreground">
                {profile.fullName}
              </span>
            )}
          </SettingsRow>

          <SettingsDivider />

          <SettingsRow label={t("email")}>
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground">{profile.email}</span>
            </div>
          </SettingsRow>

          <SettingsDivider />

          <SettingsRow label={t("phone")}>
            {isEditing ? (
              <Input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+84 xxx xxx xxx"
                className="w-64"
              />
            ) : (
              <span className="text-sm text-foreground">
                {profile.phone || (
                  <span className="text-muted-foreground">&mdash;</span>
                )}
              </span>
            )}
          </SettingsRow>

          {isEditing && (
            <>
              <SettingsDivider />
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isUpdating}
                >
                  {tCommon("cancel")}
                </Button>
                <Button onClick={handleSave} disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      {t("saveChanges")}
                    </>
                  ) : (
                    t("saveChanges")
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </SettingsSection>

      {/* Account Info (Read-only) */}
      <SettingsSection title={t("memberSince")}>
        <div className="space-y-1">
          <SettingsRow label="ID">
            <code className="rounded bg-muted px-2 py-1 text-xs">
              {profile.id}
            </code>
          </SettingsRow>

          <SettingsDivider />

          <SettingsRow label={t("memberSince")}>
            <span className="text-sm text-foreground">
              {dateFormatter.format(new Date(profile.createdAt))}
            </span>
          </SettingsRow>

          <SettingsDivider />

          <SettingsRow label={t("lastLogin")}>
            <span className="text-sm text-foreground">
              {profile.lastLoginAt
                ? dateTimeFormatter.format(new Date(profile.lastLoginAt))
                : "\u2014"}
            </span>
          </SettingsRow>
        </div>
      </SettingsSection>
    </div>
  );
}
