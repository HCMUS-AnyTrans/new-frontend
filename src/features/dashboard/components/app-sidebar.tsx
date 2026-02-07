"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChevronUp, LogOut, User, Settings } from "lucide-react";
import {
  LayoutDashboard,
  FileText,
  Subtitles,
  BookOpen,
  History,
  Settings as SettingsIcon,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockUser } from "../data";

interface NavItem {
  titleKey: string;
  href: string;
  icon: LucideIcon;
}

interface NavGroup {
  labelKey: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    labelKey: "mainMenu",
    items: [
      { titleKey: "dashboard", href: "/dashboard", icon: LayoutDashboard },
      { titleKey: "documents", href: "/documents", icon: FileText },
      { titleKey: "subtitles", href: "/subtitles", icon: Subtitles },
      { titleKey: "glossary", href: "/glossary", icon: BookOpen },
      { titleKey: "history", href: "/history", icon: History },
    ],
  },
  {
    labelKey: "other",
    items: [
      { titleKey: "settings", href: "/settings", icon: SettingsIcon },
      { titleKey: "help", href: "/help", icon: HelpCircle },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const t = useTranslations("dashboard.sidebar");

  // Remove locale prefix from pathname for matching
  const pathnameWithoutLocale = pathname.replace(/^\/(vi|en)/, "");

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar"
    >
      {/* Header - Logo */}
      <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="relative h-8 w-8 shrink-0">
            <Image
              src="/logo.svg"
              alt="AnyTrans Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-lg font-bold text-foreground group-data-[collapsible=icon]:hidden">
            AnyTrans
          </span>
        </Link>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.labelKey}>
            <SidebarGroupLabel className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
              {t(group.labelKey)}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathnameWithoutLocale === item.href;
                  const title = t(item.titleKey);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={title}
                      >
                        <Link href={item.href}>
                          <item.icon className="size-4" />
                          <span>{title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
            {group.labelKey === "mainMenu" && (
              <SidebarSeparator className="mt-2" />
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer - User */}
      <SidebarFooter className="gap-3">
        <SidebarSeparator />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg p-2 mx-2 text-left hover:bg-muted transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mx-0"
            >
              <Avatar className="h-9 w-9 shrink-0">
                {mockUser.avatarUrl && (
                  <AvatarImage
                    src={mockUser.avatarUrl}
                    alt={mockUser.fullName}
                  />
                )}
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                  {mockUser.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col min-w-0 group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium text-foreground truncate">
                  {mockUser.fullName}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {mockUser.email}
                </span>
              </div>
              <ChevronUp className="size-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" className="w-56 mb-2">
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center">
                <User className="mr-2 size-4" />
                {t("profile")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center">
                <Settings className="mr-2 size-4" />
                {t("settings")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
              <LogOut className="mr-2 size-4" />
              {t("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
