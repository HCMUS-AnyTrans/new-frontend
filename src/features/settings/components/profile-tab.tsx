"use client";

import { useState, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Camera, X, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  SettingsSection,
  SettingsRow,
  SettingsDivider,
} from "./settings-section";
import { mockUserProfile } from "../data";
import type { UserProfile } from "../types";

interface ProfileTabProps {
  profile?: UserProfile;
}

export function ProfileTab({ profile = mockUserProfile }: ProfileTabProps) {
  const t = useTranslations("settings.profile");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile.fullName,
    phone: profile.phone || "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSave = () => {
    // TODO: Call API to save
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Upload avatar
      console.log("Upload avatar:", file.name);
    }
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
            <button
              onClick={handleAvatarClick}
              className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              <Camera className="size-3.5" />
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleAvatarClick}>
                {t("changeAvatar")}
              </Button>
              {profile.avatarUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
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
              {profile.isOAuthUser && (
                <Lock className="size-4 text-muted-foreground" />
              )}
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
                  <span className="text-muted-foreground">—</span>
                )}
              </span>
            )}
          </SettingsRow>

          {isEditing && (
            <>
              <SettingsDivider />
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  {tCommon("cancel")}
                </Button>
                <Button onClick={handleSave}>{t("saveChanges")}</Button>
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
                : "—"}
            </span>
          </SettingsRow>
        </div>
      </SettingsSection>
    </div>
  );
}
