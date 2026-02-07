"use client"

import { useState } from "react"
import { Sun, Moon, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SettingsSection, SettingsRow, SettingsDivider } from "./settings-section"
import {
  mockUserPreferences,
  uiLanguageOptions,
  themeOptions,
  fileTtlOptions,
} from "../data"
import type { UserPreferences, UILanguage, Theme, FileTTL } from "../types"

const themeIcons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
}

interface PreferencesTabProps {
  preferences?: UserPreferences
}

export function PreferencesTab({ preferences = mockUserPreferences }: PreferencesTabProps) {
  const [formData, setFormData] = useState<UserPreferences>(preferences)
  const [hasChanges, setHasChanges] = useState(false)

  const updateField = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setFormData({ ...formData, [key]: value })
    setHasChanges(true)
  }

  const handleSave = () => {
    // TODO: Call API to save
    setHasChanges(false)
  }

  return (
    <div className="space-y-6">
      {/* Display Settings */}
      <SettingsSection title="Hiển thị">
        <div className="space-y-1">
          <SettingsRow
            label="Ngôn ngữ giao diện"
            description="Ngôn ngữ hiển thị trong ứng dụng"
          >
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

          <SettingsRow
            label="Giao diện"
            description="Chọn chế độ sáng, tối hoặc theo hệ thống"
          >
            <div className="flex gap-1">
              {themeOptions.map((theme) => {
                const Icon = themeIcons[theme.value as keyof typeof themeIcons]
                const isActive = formData.theme === theme.value
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
                    <span>{theme.label}</span>
                  </button>
                )
              })}
            </div>
          </SettingsRow>
        </div>
      </SettingsSection>

      {/* Translation Settings */}
      <SettingsSection title="Dịch thuật">
        <div className="space-y-1">
          <SettingsRow
            label="Gửi kết quả qua email"
            description="Nhận file đã dịch qua email khi hoàn tất"
          >
            <Switch
              checked={formData.sendResultViaEmail}
              onCheckedChange={(v) => updateField("sendResultViaEmail", v)}
            />
          </SettingsRow>

          <SettingsDivider />

          <SettingsRow
            label="Thời gian lưu file"
            description="File sẽ tự động xóa sau thời gian này"
          >
            <Select
              value={String(formData.fileTtl)}
              onValueChange={(v) => updateField("fileTtl", Number(v) as FileTTL)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fileTtlOptions.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {opt.label}
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
          <Button onClick={handleSave}>Lưu thay đổi</Button>
        </div>
      )}
    </div>
  )
}
