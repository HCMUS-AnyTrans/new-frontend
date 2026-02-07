"use client";

import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Bell, Coins } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { mockUser, mockWallet } from "@/data/dashboard";

// Map pathname to translation key
const pageKeyMap: Record<string, string> = {
  "/dashboard": "dashboard",
  "/documents": "documents",
  "/subtitles": "subtitles",
  "/glossary": "glossary",
  "/history": "history",
  "/settings": "settings",
  "/help": "help",
};

export function DashboardHeader() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("dashboard.pages");

  // Remove locale prefix from pathname
  const pathnameWithoutLocale = pathname.replace(/^\/(vi|en)/, "");

  // Get page title translation key
  const pageKey = pageKeyMap[pathnameWithoutLocale] || "dashboard";
  const pageTitle = t(pageKey);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background/95 backdrop-blur-sm px-4 lg:px-6">
      {/* Sidebar Toggle */}
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-6" />

      {/* Page Title */}
      <div className="flex flex-1 items-center gap-4">
        <h1 className="text-lg font-semibold text-foreground">{pageTitle}</h1>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Theme Toggle */}
        <ModeToggle />

        {/* Notification Bell */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5 text-muted-foreground" />
          {/* Notification badge */}
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
            3
          </span>
          <span className="sr-only">Notifications</span>
        </Button>

        {/* Credits Badge - Hidden on mobile */}
        <Badge
          variant="secondary"
          className="hidden gap-1.5 bg-secondary/20 text-foreground sm:flex"
        >
          <Coins className="size-3.5 text-secondary" />
          <span className="tabular-nums">
            {mockWallet.balance.toLocaleString(
              locale === "vi" ? "vi-VN" : "en-US"
            )}
          </span>
          <span className="text-muted-foreground">credits</span>
        </Badge>

        {/* User Avatar */}
        <Avatar className="h-8 w-8">
          {mockUser.avatarUrl && (
            <AvatarImage src={mockUser.avatarUrl} alt={mockUser.fullName} />
          )}
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            {mockUser.initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
