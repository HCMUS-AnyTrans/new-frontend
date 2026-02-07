"use client"

import { useState } from "react"
import {
  Key,
  Smartphone,
  Monitor,
  LogOut,
  Check,
  Link as LinkIcon,
  Unlink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { SettingsSection, SettingsRow, SettingsDivider } from "./settings-section"
import { mockAuthIdentities, mockSessions, authProviderOptions } from "../data"
import type { AuthIdentity, Session, AuthProvider } from "../types"

interface SecurityTabProps {
  identities?: AuthIdentity[]
  sessions?: Session[]
}

export function SecurityTab({
  identities = mockAuthIdentities,
  sessions = mockSessions,
}: SecurityTabProps) {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)

  const linkedProviders = identities.map((i) => i.provider)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Vừa xong"
    if (diffMins < 60) return `${diffMins} phút trước`
    if (diffHours < 24) return `${diffHours} giờ trước`
    if (diffDays < 7) return `${diffDays} ngày trước`
    return date.toLocaleDateString("vi-VN")
  }

  const getDeviceIcon = (device: string) => {
    return device.toLowerCase().includes("mobile") ? Smartphone : Monitor
  }

  return (
    <div className="space-y-6">
      {/* Password Section */}
      <SettingsSection
        title="Mật khẩu"
        description="Quản lý mật khẩu đăng nhập của bạn"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
              <Key className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">••••••••••</p>
              <p className="text-sm text-muted-foreground">
                Đổi mật khẩu lần cuối: 30 ngày trước
              </p>
            </div>
          </div>

          <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">Đổi mật khẩu</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Đổi mật khẩu</DialogTitle>
                <DialogDescription>
                  Nhập mật khẩu hiện tại và mật khẩu mới
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="current">Mật khẩu hiện tại</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">Mật khẩu mới</Label>
                  <Input id="new" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Xác nhận mật khẩu mới</Label>
                  <Input id="confirm" type="password" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                  Hủy
                </Button>
                <Button>Đổi mật khẩu</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </SettingsSection>

      {/* OAuth Providers */}
      <SettingsSection
        title="Phương thức đăng nhập"
        description="Liên kết tài khoản với các nhà cung cấp khác"
      >
        <div className="space-y-1">
          {authProviderOptions.map((provider, idx) => {
            const isLinked = linkedProviders.includes(provider.id as AuthProvider)
            const identity = identities.find((i) => i.provider === provider.id)

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
                        Đã liên kết
                      </Badge>
                      {linkedProviders.length > 1 && (
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          <Unlink className="size-4" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Button variant="outline" size="sm">
                      <LinkIcon className="size-4" />
                      Liên kết
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
        title="Phiên đăng nhập"
        description="Quản lý các thiết bị đã đăng nhập"
        action={
          sessions.length > 1 && (
            <Button variant="outline" size="sm" className="text-destructive">
              Đăng xuất tất cả
            </Button>
          )
        }
      >
        <div className="space-y-1">
          {sessions.map((session, idx) => {
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
                            Hiện tại
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {session.location} • {formatDate(session.lastActiveAt)}
                      </p>
                    </div>
                  </div>

                  {!session.isCurrent && (
                    <Button variant="ghost" size="sm" className="text-destructive">
                      <LogOut className="size-4" />
                      Đăng xuất
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
