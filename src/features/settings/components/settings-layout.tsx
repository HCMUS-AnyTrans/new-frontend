"use client"

import { useState } from "react"
import {
  User,
  Settings,
  Shield,
  Bell,
  CreditCard,
  FolderOpen,
  History,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { SettingsTab } from "../types"

// Icon mapping
const iconMap = {
  User,
  Settings,
  Shield,
  Bell,
  CreditCard,
  FolderOpen,
  History,
}

interface TabConfig {
  id: SettingsTab
  label: string
  icon: keyof typeof iconMap
}

const tabs: TabConfig[] = [
  { id: "profile", label: "Hồ sơ", icon: "User" },
  { id: "preferences", label: "Tùy chọn", icon: "Settings" },
  { id: "security", label: "Bảo mật", icon: "Shield" },
  { id: "notifications", label: "Thông báo", icon: "Bell" },
  { id: "billing", label: "Thanh toán", icon: "CreditCard" },
  { id: "files", label: "Tệp", icon: "FolderOpen" },
  { id: "activity", label: "Hoạt động", icon: "History" },
]

interface SettingsLayoutProps {
  children: React.ReactNode
  defaultTab?: SettingsTab
  onTabChange?: (tab: SettingsTab) => void
}

export function SettingsLayout({
  children,
  defaultTab = "profile",
  onTabChange,
}: SettingsLayoutProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>(defaultTab)

  const handleTabChange = (value: string) => {
    const tab = value as SettingsTab
    setActiveTab(tab)
    onTabChange?.(tab)
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList
          variant="line"
          className="mb-6 w-full flex-wrap justify-start gap-1 border-b"
        >
          {tabs.map((tab) => {
            const Icon = iconMap[tab.icon]
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="gap-2 px-3 py-2 ring-0 ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <Icon className="size-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {/* Tab Content */}
        {children}
      </Tabs>
    </div>
  )
}

// Re-export TabsContent for convenience
export { TabsContent as SettingsTabContent }
