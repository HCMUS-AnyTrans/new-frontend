"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
import { mockUserPreferences, uiLanguageOptions } from "../data";
import type { UserPreferences, UILanguage, Theme, FileTTL } from "../types";

const themeIcons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

interface PreferencesTabProps {
  preferences?: UserPreferences;
}

export function PreferencesTab({
  preferences = mockUserPreferences,
}: PreferencesTabProps) {
  const t = useTranslations("settings.preferences");

  const [formData, setFormData] = useState<UserPreferences>(preferences);
  const [hasChanges, setHasChanges] = useState(false);

  const updateField = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setFormData({ ...formData, [key]: value });
    setHasChanges(true);
  };

  const handleSave = () => {
    // TODO: Call API to save
    setHasChanges(false);
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
          <Button onClick={handleSave}>{t("title")}</Button>
        </div>
      )}
    </div>
  );
}
