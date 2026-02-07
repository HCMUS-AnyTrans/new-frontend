"use client"

import { Download, History, Monitor, Smartphone, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SettingsSection, SettingsDivider } from "./settings-section"
import { mockAuditLogs } from "../data"
import type { AuditLog, AuditAction } from "../types"
import { cn } from "@/lib/utils"
import { useState } from "react"

const actionConfig: Record<AuditAction, { label: string; color: string }> = {
  login: { label: "Đăng nhập", color: "bg-success/10 text-success" },
  logout: { label: "Đăng xuất", color: "bg-muted text-muted-foreground" },
  password_change: { label: "Đổi mật khẩu", color: "bg-warning/10 text-warning" },
  profile_update: { label: "Cập nhật hồ sơ", color: "bg-primary/10 text-primary" },
  provider_link: { label: "Liên kết tài khoản", color: "bg-info/10 text-info" },
  provider_unlink: { label: "Hủy liên kết", color: "bg-warning/10 text-warning" },
  session_revoke: { label: "Đăng xuất thiết bị", color: "bg-destructive/10 text-destructive" },
  file_upload: { label: "Tải lên tệp", color: "bg-primary/10 text-primary" },
  file_delete: { label: "Xóa tệp", color: "bg-destructive/10 text-destructive" },
  translation_start: { label: "Bắt đầu dịch", color: "bg-primary/10 text-primary" },
  translation_complete: { label: "Dịch hoàn tất", color: "bg-success/10 text-success" },
  credit_purchase: { label: "Nạp credits", color: "bg-success/10 text-success" },
  settings_change: { label: "Thay đổi cài đặt", color: "bg-muted text-muted-foreground" },
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

interface ActivityTabProps {
  logs?: AuditLog[]
}

export function ActivityTab({ logs = mockAuditLogs }: ActivityTabProps) {
  const [filter, setFilter] = useState<string>("all")

  const filteredLogs = filter === "all"
    ? logs
    : logs.filter((log) => log.action === filter)

  const handleExport = () => {
    // TODO: Call API to export CSV
    console.log("Export activity logs")
  }

  const getDeviceIcon = (device: string) => {
    return device.toLowerCase().includes("mobile") ? Smartphone : Monitor
  }

  return (
    <div className="space-y-6">
      {/* Activity Log */}
      <SettingsSection
        title="Nhật ký hoạt động"
        description="Lịch sử các hoạt động trên tài khoản của bạn"
        action={
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <Filter className="mr-2 size-4" />
                <SelectValue placeholder="Lọc" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="login">Đăng nhập</SelectItem>
                <SelectItem value="translation_complete">Dịch thuật</SelectItem>
                <SelectItem value="credit_purchase">Thanh toán</SelectItem>
                <SelectItem value="settings_change">Cài đặt</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="size-4" />
              Xuất CSV
            </Button>
          </div>
        }
      >
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <History className="mb-2 size-8" />
            <p>Không có hoạt động nào</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredLogs.map((log, idx) => {
              const config = actionConfig[log.action]
              const DeviceIcon = getDeviceIcon(log.device)

              return (
                <div key={log.id}>
                  {idx > 0 && <SettingsDivider />}
                  <div className="flex items-start justify-between gap-4 py-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <DeviceIcon className="size-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className={cn("text-xs", config.color)} variant="secondary">
                            {config.label}
                          </Badge>
                          <span className="text-sm text-foreground">
                            {log.description}
                          </span>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <span>{formatDateTime(log.createdAt)}</span>
                          <span>•</span>
                          <span>{log.browser}</span>
                          <span>•</span>
                          <span>{log.ip}</span>
                          {log.location && (
                            <>
                              <span>•</span>
                              <span>{log.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </SettingsSection>
    </div>
  )
}
