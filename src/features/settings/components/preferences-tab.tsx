"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Sun, Moon, Monitor, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import type { UILanguage, Theme, FileTTL } from "../types";

const themeIcons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

// Hours options for fileTtl
const FILE_TTL_OPTIONS: { value: FileTTL; hours: number }[] = [
  { value: 1, hours: 1 },
  { value: 6, hours: 6 },
  { value: 12, hours: 12 },
  { value: 24, hours: 24 },
];

const DEFAULT_FILE_TTL: FileTTL = 6;

function normalizeFileTtl(value: number | null | undefined): FileTTL {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.floor(value);
  }

  return DEFAULT_FILE_TTL;
}

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
  const [selectedFileTtl, setSelectedFileTtl] = useState<FileTTL | null>(null);
  const [customFileTtlInput, setCustomFileTtlInput] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  // Show skeleton while loading
  if (isLoading || !preferences) {
    return <PreferencesTabSkeleton />;
  }

  const normalizedPreferenceFileTtl = normalizeFileTtl(preferences.fileTtl);
  const currentFileTtl = selectedFileTtl ?? normalizedPreferenceFileTtl;
  const isPresetFileTtl = FILE_TTL_OPTIONS.some(
    (option) => option.value === currentFileTtl,
  );
  const showCustomFileTtlInput = customFileTtlInput !== "" || !isPresetFileTtl;
  const hasInvalidLegacyTtl = false;

  const handleFileTtlChange = (value: FileTTL) => {
    setSelectedFileTtl(value);
    setCustomFileTtlInput("");
    setHasChanges(true);
  };

  const handleFileTtlSelectChange = (value: string) => {
    if (value === "custom") {
      setSelectedFileTtl(currentFileTtl);
      setCustomFileTtlInput(String(currentFileTtl));
      return;
    }

    handleFileTtlChange(Number(value));
  };

  const handleCustomFileTtlChange = (value: string) => {
    const sanitizedValue = value.replace(/[^0-9]/g, "");

    setCustomFileTtlInput(sanitizedValue);

    if (!sanitizedValue) return;

    const hours = Number(sanitizedValue);
    if (hours > 0) {
      setSelectedFileTtl(hours);
      setHasChanges(true);
    }
  };

  const handleSave = () => {
    updatePreferences(
      { fileTtl: currentFileTtl },
      {
        onSuccess: () => {
          setHasChanges(false);
          setSelectedFileTtl(null);
        },
      },
    );
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
          <SettingsRow
            label={t("language")}
            description={t("languageDescription")}
          >
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
              value={showCustomFileTtlInput ? "custom" : String(currentFileTtl)}
              onValueChange={handleFileTtlSelectChange}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FILE_TTL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    {t("hours", { count: option.hours })}
                  </SelectItem>
                ))}
                <SelectItem value="custom">{t("custom")}</SelectItem>
              </SelectContent>
            </Select>
            {showCustomFileTtlInput ? (
              <div className="flex items-center mt-2 gap-2">
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={customFileTtlInput || String(currentFileTtl)}
                  onChange={(e) => handleCustomFileTtlChange(e.target.value)}
                  className="w-32"
                  placeholder={t("customHoursPlaceholder")}
                />
                <span className="text-sm text-muted-foreground">
                  {t("hourUnit")}
                </span>
              </div>
            ) : null}
          </SettingsRow>
        </div>
      </SettingsSection>

      {/* Save Button */}
      {(hasChanges || hasInvalidLegacyTtl) && (
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
