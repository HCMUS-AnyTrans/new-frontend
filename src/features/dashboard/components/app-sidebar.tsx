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
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
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
  const { toggleSidebar, open } = useSidebar();

  // Remove locale prefix from pathname for matching
  const pathnameWithoutLocale = pathname.replace(/^\/(vi|en)/, "");

  return (
    <Sidebar
      collapsible="icon"
      className="h-svh border-r border-sidebar-border bg-sidebar pt-(--dashboard-header-height)"
    >
      {/* Main Navigation */}
      <SidebarContent className={`pt-4 ${open ? "px-2" : "px-0"}`}>
        <SidebarMenu className="gap-1">
          {navItems.map((item) => {
            const isActive =
              pathnameWithoutLocale === item.href ||
              pathnameWithoutLocale.startsWith(item.href + "/");
            const title = t(item.titleKey);

            return (
              <SidebarMenuItem
                key={item.href}
                className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center"
              >
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={title}
                  className="text-sidebar-foreground"
                >
                  <Link href={item.href}>
                    <item.icon className="size-5" />
                    {open && <span>{title}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Collapse / Expand round button on the right edge */}
      <button
        onClick={toggleSidebar}
        className="absolute top-1/2 -right-3.5 z-20 hidden -translate-y-1/2 size-7 items-center justify-center rounded-full border border-sidebar-border bg-background shadow-sm transition-colors hover:bg-muted md:flex"
      >
        <ChevronRight
          className="size-3.5 text-muted-foreground transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
    </Sidebar>
  );
}
