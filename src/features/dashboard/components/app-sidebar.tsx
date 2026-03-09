"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
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
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

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

  // Remove locale prefix from pathname for matching
  const pathnameWithoutLocale = pathname.replace(/^\/(vi|en)/, "");

  return (
    <Sidebar
      collapsible="offcanvas"
      className="h-svh border-r border-sidebar-border bg-sidebar pt-[var(--dashboard-header-height)]"
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

    </Sidebar>
  );
}
