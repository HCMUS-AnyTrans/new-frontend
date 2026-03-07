"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  Search,
  ChevronDown,
  Coins,
  LogOut,
  User,
  CreditCard,
  Bell,
  SlidersHorizontal,
  Shield,
  FolderOpen,
  History,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore, useLogout } from "@/features/auth";
import { BuyCreditsDialog } from "./buy-credits-dialog";
import { useWallet } from "../hooks";

export function DashboardHeader() {
  const locale = useLocale();
  const tSidebar = useTranslations("dashboard.sidebar");
  const tHeaderMenu = useTranslations("dashboard.headerMenu");
  const user = useAuthStore((s) => s.user);
  const { logout } = useLogout();
  const { wallet, isLoading: walletLoading } = useWallet();

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-[var(--dashboard-header-height)] items-center justify-between border-b border-border bg-background px-4 lg:px-6">
      <div className="flex min-w-0 items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8 shrink-0">
            <Image
              src="/logo.svg"
              alt="AnyTrans Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-lg font-bold tracking-tight text-primary">
            AnyTrans
          </span>
        </Link>
      </div>

      <div className="hidden flex-1 px-6 lg:block">
        <div className="relative mx-auto w-full max-w-md">
          <input
            type="text"
            placeholder="Search"
            className="h-9 w-full rounded-full border border-input bg-background pl-4 pr-10 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {walletLoading ? (
          <Skeleton className="hidden h-9 w-28 rounded-full md:block" />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="hidden h-9 items-center gap-2 rounded-full border border-input px-3 text-sm md:flex"
                title="Credits"
              >
                <Coins className="size-4 text-primary" />
                <span className="font-semibold text-foreground tabular-nums">
                  {(wallet?.balance ?? 0).toLocaleString(
                    locale === "vi" ? "vi-VN" : "en-US",
                  )}
                </span>
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <BuyCreditsDialog>
                <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                  <Coins className="mr-2 size-4 text-primary" />
                  {tHeaderMenu("buyMoreCredits")}
                </DropdownMenuItem>
              </BuyCreditsDialog>
              <DropdownMenuItem asChild>
                <Link href="/settings?tab=billing">
                  <CreditCard className="mr-2 size-4" />
                  {tHeaderMenu("paymentHistory")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex h-9 items-center gap-1 rounded-full border border-input bg-background pl-1 pr-2 transition-colors hover:bg-muted"
            >
              <Avatar className="h-8 w-8">
                {user?.avatarUrl && (
                  <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                )}
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="mr-1 hidden size-3.5 text-muted-foreground sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
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
      </div>
    </header>
  );
}
