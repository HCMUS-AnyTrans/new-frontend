"use client";

import {
  LogOut,
  User,
  CreditCard,
  Bell,
  SlidersHorizontal,
  Shield,
  FolderOpen,
  History,
  LayoutDashboard,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore, useLogout } from "@/features/auth";
import { useTranslations } from "next-intl";
import type { User as AuthUser } from "@/features/auth/types";

export interface UserAvatarMenuProps {
  /** Show Dashboard link at top (e.g. for marketing header) */
  showDashboardLink?: boolean;
  /** Custom class for the trigger button */
  triggerClassName?: string;
  /** Avatar size: sm (h-7 w-7), default (h-8 w-8), lg (h-9 w-9) */
  size?: "sm" | "default" | "lg";
}

export function getUserInitials(user: AuthUser | null | undefined): string {
  if (!user?.fullName) return "??";
  return user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const sizeClasses = {
  sm: "h-7 w-7",
  default: "h-8 w-8",
  lg: "h-9 w-9",
};

export function UserAvatarMenu({
  showDashboardLink = false,
  triggerClassName,
  size = "default",
}: UserAvatarMenuProps) {
  const user = useAuthStore((s) => s.user);
  const { logout } = useLogout();
  const tSidebar = useTranslations("dashboard.sidebar");
  const tHeaderMenu = useTranslations("dashboard.headerMenu");

  const initials = getUserInitials(user);
  const avatarSize = sizeClasses[size];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={
            triggerClassName ??
            "flex h-9 items-center rounded-full border border-input bg-background p-0.5 transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          }
        >
          <Avatar className={avatarSize}>
            {user?.avatarUrl && (
              <AvatarImage src={user.avatarUrl} alt={user.fullName} />
            )}
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        {showDashboardLink && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 size-4" />
                {tSidebar("dashboard")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem asChild>
          <Link href="/settings?tab=profile">
            <User className="mr-2 size-4" />
            {tSidebar("profile")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings?tab=billing">
            <CreditCard className="mr-2 size-4" />
            {tHeaderMenu("payment")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings?tab=notifications">
            <Bell className="mr-2 size-4" />
            {tHeaderMenu("notifications")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings?tab=preferences">
            <SlidersHorizontal className="mr-2 size-4" />
            {tHeaderMenu("references")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings?tab=security">
            <Shield className="mr-2 size-4" />
            {tHeaderMenu("security")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings?tab=files">
            <FolderOpen className="mr-2 size-4" />
            {tHeaderMenu("files")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings?tab=activity">
            <History className="mr-2 size-4" />
            {tHeaderMenu("activity")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => logout()}
          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <LogOut className="mr-2 size-4 text-destructive" />
          {tSidebar("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Menu items config for rendering in mobile/list layouts */
export const userMenuItemsConfig = [
  { href: "/dashboard", icon: LayoutDashboard, labelKey: "dashboard", ns: "sidebar" as const },
  { href: "/settings?tab=profile", icon: User, labelKey: "profile", ns: "sidebar" as const },
  { href: "/settings?tab=billing", icon: CreditCard, labelKey: "payment", ns: "headerMenu" as const },
  { href: "/settings?tab=notifications", icon: Bell, labelKey: "notifications", ns: "headerMenu" as const },
  {
    href: "/settings?tab=preferences",
    icon: SlidersHorizontal,
    labelKey: "references",
    ns: "headerMenu" as const,
  },
  { href: "/settings?tab=security", icon: Shield, labelKey: "security", ns: "headerMenu" as const },
  { href: "/settings?tab=files", icon: FolderOpen, labelKey: "files", ns: "headerMenu" as const },
  { href: "/settings?tab=activity", icon: History, labelKey: "activity", ns: "headerMenu" as const },
] as const;

export interface UserMenuListProps {
  /** Include Dashboard link at top */
  showDashboardLink?: boolean;
  /** Called when an item is clicked (e.g. close mobile menu) */
  onItemClick?: () => void;
}

/** Renders user menu items as a vertical list (for mobile menu) */
export function UserMenuList({
  showDashboardLink = false,
  onItemClick,
}: UserMenuListProps) {
  const tSidebar = useTranslations("dashboard.sidebar");
  const tHeaderMenu = useTranslations("dashboard.headerMenu");
  const { logout } = useLogout();

  const getLabel = (item: (typeof userMenuItemsConfig)[number]) =>
    item.ns === "sidebar" ? tSidebar(item.labelKey) : tHeaderMenu(item.labelKey);

  const items = showDashboardLink
    ? userMenuItemsConfig
    : userMenuItemsConfig.filter((i) => i.href !== "/dashboard");

  return (
    <div className="flex flex-col gap-1">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-foreground hover:text-primary hover:bg-primary-50 dark:hover:bg-primary-900"
          >
            <Icon className="size-4 shrink-0" />
            {getLabel(item)}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={() => {
          onItemClick?.();
          logout();
        }}
        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-destructive hover:bg-destructive/10 text-left w-full"
      >
        <LogOut className="size-4 shrink-0" />
        {tSidebar("logout")}
      </button>
    </div>
  );
}
