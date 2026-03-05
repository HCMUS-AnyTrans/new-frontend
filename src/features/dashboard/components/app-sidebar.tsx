"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChevronUp, LogOut, User, Settings } from "lucide-react";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  History,
  Settings as SettingsIcon,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
import { useAuthStore, useLogout } from "@/features/auth";

interface NavItem {
  titleKey: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { titleKey: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  { titleKey: "documents", href: "/documents", icon: FileText },
  { titleKey: "glossary", href: "/glossary", icon: BookOpen },
  { titleKey: "history", href: "/history", icon: History },
  { titleKey: "settings", href: "/settings", icon: SettingsIcon },
  { titleKey: "help", href: "/help", icon: HelpCircle },
];

export function AppSidebar() {
  const pathname = usePathname();
  const t = useTranslations("dashboard.sidebar");
  const user = useAuthStore((s) => s.user);
  const { logout } = useLogout();

  // Remove locale prefix from pathname for matching
  const pathnameWithoutLocale = pathname.replace(/^\/(vi|en)/, "");

  // Generate user initials from fullName
  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  const handleLogout = () => {
    logout();
  };

  return (
    <Sidebar
      collapsible="none"
      className="h-svh border-r border-sidebar-border bg-[#ffffff] pt-[var(--dashboard-header-height)]"
    >
      {/* Main Navigation */}
      <SidebarContent className="px-2 pt-4">
        <SidebarMenu className="gap-1 px-2">
          {navItems.map((item) => {
            const isActive =
              pathnameWithoutLocale === item.href ||
              pathnameWithoutLocale.startsWith(item.href + "/");
            const title = t(item.titleKey);

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={title}
                  className="text-sidebar-foreground"
                >
                  <Link href={item.href}>
                    <item.icon className="size-5" />
                    <span>{title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer - User */}
      <SidebarFooter className="mt-auto gap-2 pb-3">
        <SidebarSeparator />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="mx-2 flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-sidebar-accent group-data-[collapsible=icon]:mx-0 group-data-[collapsible=icon]:justify-center"
            >
              <Avatar className="h-9 w-9 shrink-0">
                {user?.avatarUrl && (
                  <AvatarImage
                    src={user.avatarUrl}
                    alt={user.fullName}
                  />
                )}
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col min-w-0 group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium text-foreground truncate">
                  {user?.fullName || "---"}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {user?.email || "---"}
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
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <LogOut className="mr-2 size-4" />
              {t("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
