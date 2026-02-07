"use client"

import { useState, useRef } from "react"
import { Camera, X, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { SettingsSection, SettingsRow, SettingsDivider } from "./settings-section"
import { mockUserProfile } from "../data"
import type { UserProfile } from "../types"

interface ProfileTabProps {
  profile?: UserProfile
}

export function ProfileTab({ profile = mockUserProfile }: ProfileTabProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: profile.fullName,
    phone: profile.phone || "",
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleSave = () => {
    // TODO: Call API to save
    setIsEditing(false)
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // TODO: Upload avatar
      console.log("Upload avatar:", file.name)
    }
  }

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <SettingsSection title="Ảnh đại diện">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="size-20">
              <AvatarImage src={profile.avatarUrl || undefined} alt={profile.fullName} />
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
                Thay đổi
              </Button>
              {profile.avatarUrl && (
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <X className="size-4" />
                  Xóa
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              JPG, PNG hoặc GIF. Tối đa 2MB.
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
        title="Thông tin cá nhân"
        action={
          !isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Chỉnh sửa
            </Button>
          ) : null
        }
      >
        <div className="space-y-1">
          <SettingsRow label="Họ và tên">
            {isEditing ? (
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-64"
              />
            ) : (
              <span className="text-sm text-foreground">{profile.fullName}</span>
            )}
          </SettingsRow>

          <SettingsDivider />

          <SettingsRow
            label="Email"
            description={profile.isOAuthUser ? "Được quản lý bởi nhà cung cấp OAuth" : undefined}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground">{profile.email}</span>
              {profile.isOAuthUser && (
                <Lock className="size-4 text-muted-foreground" />
              )}
            </div>
          </SettingsRow>

          <SettingsDivider />

          <SettingsRow label="Số điện thoại">
            {isEditing ? (
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+84 xxx xxx xxx"
                className="w-64"
              />
            ) : (
              <span className="text-sm text-foreground">
                {profile.phone || <span className="text-muted-foreground">Chưa cập nhật</span>}
              </span>
            )}
          </SettingsRow>

          {isEditing && (
            <>
              <SettingsDivider />
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Hủy
                </Button>
                <Button onClick={handleSave}>Lưu thay đổi</Button>
              </div>
            </>
          )}
        </div>
      </SettingsSection>

      {/* Account Info (Read-only) */}
      <SettingsSection title="Thông tin tài khoản">
        <div className="space-y-1">
          <SettingsRow label="ID tài khoản">
            <code className="rounded bg-muted px-2 py-1 text-xs">{profile.id}</code>
          </SettingsRow>

          <SettingsDivider />

          <SettingsRow label="Ngày tạo">
            <span className="text-sm text-foreground">
              {new Date(profile.createdAt).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </SettingsRow>

          <SettingsDivider />

          <SettingsRow label="Đăng nhập gần nhất">
            <span className="text-sm text-foreground">
              {profile.lastLoginAt
                ? new Date(profile.lastLoginAt).toLocaleString("vi-VN")
                : "Không có dữ liệu"}
            </span>
          </SettingsRow>
        </div>
      </SettingsSection>
    </div>
  )
}
