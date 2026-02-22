"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Sun, Moon, Monitor, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useThemeSync } from "../hooks/use-theme-sync";
import { useLanguageSync } from "../hooks/use-language-sync";
import type { UserPreferences, UILanguage, Theme, FileTTL } from "../types";

const themeIcons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

// Minutes to days mapping for fileTtl
const FILE_TTL_OPTIONS: { value: FileTTL; days: number }[] = [
  { value: 10080, days: 7 },
  { value: 20160, days: 14 },
  { value: 43200, days: 30 },
  { value: 86400, days: 60 },
  { value: 129600, days: 90 },
];

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

      {/* File Settings Skeleton */}
      <div className="rounded-lg border bg-card p-6">
        <Skeleton className="mb-4 h-5 w-32" />
        <div className="space-y-4">
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
  const tCommon = useTranslations("common");

  // Data hooks
  const { preferences, isLoading } = usePreferences();
  const { updatePreferences, isUpdating } = useUpdatePreferences();

  // Theme hook — instant apply + backend sync
  const { theme: activeTheme, changeTheme } = useThemeSync();

  // Language hook — instant apply + backend sync
  const { locale, changeLanguage } = useLanguageSync();

  // Local state (fileTtl only — theme and language are handled instantly)
  const [formData, setFormData] = useState<Pick<UserPreferences, "fileTtl"> | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Sync form data when preferences load
  useEffect(() => {
    if (preferences && !formData) {
      setFormData({ fileTtl: preferences.fileTtl });
    }
  }, [preferences, formData]);

  // Show skeleton while loading
  if (isLoading || !preferences || !formData) {
    return <PreferencesTabSkeleton />;
  }

  const handleFileTtlChange = (value: FileTTL) => {
    setFormData({ fileTtl: value });
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

  return (
    <div className="space-y-6">
      {/* Display Settings */}
      <SettingsSection title={t("title")} description={t("description")}>
        <div className="space-y-1">
          <SettingsRow label={t("language")} description={t("languageDescription")}>
            <div className="flex gap-1">
              {uiLanguageOptions.map((lang) => {
                const isActive = locale === lang.value;
                return (
                  <button
                    key={lang.value}
                    onClick={() => changeLanguage(lang.value as UILanguage)}
                    className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors ${
                      isActive
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-card text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                );
              })}
            </div>
          </SettingsRow>

          <SettingsDivider />

          <SettingsRow label={t("theme")} description={t("themeDescription")}>
            <div className="flex gap-1">
              {themeOptions.map((opt) => {
                const Icon = themeIcons[opt.value as keyof typeof themeIcons];
                const isActive = activeTheme === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => changeTheme(opt.value as Theme)}
                    className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors ${
                      isActive
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-card text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Icon className="size-4" />
                    <span>{t(opt.labelKey)}</span>
                  </button>
                );
              })}
            </div>
          </SettingsRow>
        </div>
      </SettingsSection>

      {/* File Settings */}
      <SettingsSection title={t("fileTtl")}>
        <div className="space-y-1">
          <SettingsRow
            label={t("fileTtl")}
            description={t("fileTtlDescription")}
          >
            <Select
              value={String(formData.fileTtl)}
              onValueChange={(v) => handleFileTtlChange(Number(v) as FileTTL)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FILE_TTL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    {t("days", { count: option.days })}
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
                {tCommon("save")}
              </>
            ) : (
              tCommon("save")
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
