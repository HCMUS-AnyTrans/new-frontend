"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  User,
  Settings,
  Shield,
  Bell,
  CreditCard,
  FolderOpen,
  History,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { SettingsTab } from "../types";

// Icon mapping
const iconMap = {
  User,
  Settings,
  Shield,
  Bell,
  CreditCard,
  FolderOpen,
  History,
};

interface TabConfig {
  id: SettingsTab;
  labelKey: string;
  icon: keyof typeof iconMap;
}

const tabConfigs: TabConfig[] = [
  { id: "profile", labelKey: "profile", icon: "User" },
  { id: "preferences", labelKey: "preferences", icon: "Settings" },
  { id: "security", labelKey: "security", icon: "Shield" },
  { id: "notifications", labelKey: "notifications", icon: "Bell" },
  { id: "billing", labelKey: "billing", icon: "CreditCard" },
  { id: "files", labelKey: "files", icon: "FolderOpen" },
  { id: "activity", labelKey: "activity", icon: "History" },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
  defaultTab?: SettingsTab;
  onTabChange?: (tab: SettingsTab) => void;
}

const validTabs = tabConfigs.map((t) => t.id);

export function SettingsLayout({
  children,
  defaultTab = "profile",
  onTabChange,
}: SettingsLayoutProps) {
  const searchParams = useSearchParams();
  const t = useTranslations("settings.tabs");

  // Read ?tab= from URL to support deep-linking (e.g. /settings?tab=security)
  const tabFromUrl = searchParams.get("tab") as SettingsTab | null;
  const initialTab =
    tabFromUrl && validTabs.includes(tabFromUrl) ? tabFromUrl : defaultTab;

  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);

  const handleTabChange = (value: string) => {
    const tab = value as SettingsTab;
    setActiveTab(tab);
    onTabChange?.(tab);

    // Sync URL search params so the tab is preserved on refresh / shareable
    const url = new URL(window.location.href);
    if (tab === "profile") {
      url.searchParams.delete("tab");
    } else {
      url.searchParams.set("tab", tab);
    }
    window.history.replaceState({}, "", url.toString());
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Tabs Navigation */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList
          variant="line"
          className="mb-6 w-full flex-wrap justify-start gap-1 border-b"
        >
          {tabConfigs.map((tab) => {
            const Icon = iconMap[tab.icon];
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="gap-2 px-3 py-2 ring-0 ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <Icon className="size-4" />
                <span className="hidden sm:inline">{t(tab.labelKey)}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Tab Content */}
        {children}
      </Tabs>
    </div>
  );
}

// Re-export TabsContent for convenience
export { TabsContent as SettingsTabContent };
