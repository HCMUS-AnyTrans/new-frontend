"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Sun, Moon, Monitor, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SettingsSection,
  SettingsRow,
  SettingsDivider,
} from "./settings-section";
import { uiLanguageOptions } from "../data";
import { usePreferences, useUpdatePreferences } from "../hooks/use-preferences";
import type { UserPreferences, UILanguage, Theme, FileTTL } from "../types";

const themeIcons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

// ============================================================================
// Skeleton Loading State
// ============================================================================

function PreferencesTabSkeleton() {
  return (
    <div className="space-y-6">
      {/* Display Settings Skeleton */}
      <div className="rounded-lg border bg-card p-6">
        <Skeleton className="mb-1 h-5 w-24" />
        <Skeleton className="mb-4 h-4 w-48" />
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="h-9 w-48" />
          </div>
          <div className="border-t" />
          <div className="flex items-center justify-between py-2">
            <div className="space-y-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-36" />
            </div>
            <div className="flex gap-1">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </div>
      </div>

      {/* Translation Settings Skeleton */}
      <div className="rounded-lg border bg-card p-6">
        <Skeleton className="mb-4 h-5 w-32" />
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="space-y-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-52" />
            </div>
            <Skeleton className="h-5 w-9" />
          </div>
          <div className="border-t" />
          <div className="flex items-center justify-between py-2">
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-44" />
            </div>
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function PreferencesTab() {
  const t = useTranslations("settings.preferences");

  // Data hooks
  const { preferences, isLoading } = usePreferences();
  const { updatePreferences, isUpdating } = useUpdatePreferences();

  // Local state
  const [formData, setFormData] = useState<UserPreferences | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Sync form data when preferences load
  useEffect(() => {
    if (preferences && !formData) {
      setFormData(preferences);
    }
  }, [preferences, formData]);

  // Show skeleton while loading
  if (isLoading || !preferences || !formData) {
    return <PreferencesTabSkeleton />;
  }

  const updateField = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setFormData({ ...formData, [key]: value });
    setHasChanges(true);
  };

  const handleSave = () => {
    updatePreferences(formData, {
      onSuccess: () => {
        setHasChanges(false);
      },
    });
  };

  const themeOptions = [
    { value: "light", labelKey: "themeLight" },
    { value: "dark", labelKey: "themeDark" },
    { value: "system", labelKey: "themeSystem" },
  ] as const;

  const fileTtlOptions = [7, 14, 30, 60, 90] as const;

  return (
    <div className="space-y-6">
      {/* Display Settings */}
      <SettingsSection title={t("title")} description={t("description")}>
        <div className="space-y-1">
          <SettingsRow label={t("language")} description={t("languageDescription")}>
            <Select
              value={formData.uiLanguage}
              onValueChange={(v) => updateField("uiLanguage", v as UILanguage)}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {uiLanguageOptions.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SettingsRow>

          <SettingsDivider />

          <SettingsRow label={t("theme")} description={t("themeDescription")}>
            <div className="flex gap-1">
              {themeOptions.map((theme) => {
                const Icon = themeIcons[theme.value as keyof typeof themeIcons];
                const isActive = formData.theme === theme.value;
                return (
                  <button
                    key={theme.value}
                    onClick={() => updateField("theme", theme.value as Theme)}
                    className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors ${
                      isActive
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-card text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Icon className="size-4" />
                    <span>{t(theme.labelKey)}</span>
                  </button>
                );
              })}
            </div>
          </SettingsRow>
        </div>
      </SettingsSection>

      {/* Translation Settings */}
      <SettingsSection title={t("emailResults")}>
        <div className="space-y-1">
          <SettingsRow
            label={t("emailResults")}
            description={t("emailResultsDescription")}
          >
            <Switch
              checked={formData.sendResultViaEmail}
              onCheckedChange={(v) => updateField("sendResultViaEmail", v)}
            />
          </SettingsRow>

          <SettingsDivider />

          <SettingsRow
            label={t("fileTtl")}
            description={t("fileTtlDescription")}
          >
            <Select
              value={String(formData.fileTtl)}
              onValueChange={(v) => updateField("fileTtl", Number(v) as FileTTL)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fileTtlOptions.map((days) => (
                  <SelectItem key={days} value={String(days)}>
                    {t("days", { count: days })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SettingsRow>
        </div>
      </SettingsSection>

      {/* Save Button */}
      {hasChanges && (
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                {t("title")}
              </>
            ) : (
              t("title")
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
