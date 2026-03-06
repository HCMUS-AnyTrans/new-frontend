"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Search, MoreVertical, ChevronDown, Coins, LogOut } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore, useLogout } from "@/features/auth";
import { useWallet } from "../hooks";

export function DashboardHeader() {
  const locale = useLocale();
  const tSidebar = useTranslations("dashboard.sidebar");
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
          <span className="text-lg font-bold tracking-tight text-primary">AnyTrans</span>
        </Link>
      </div>

      <div className="hidden flex-1 px-6 lg:block">
        <div className="relative mx-auto w-full max-w-md">
          <input
            type="text"
            placeholder="Search..."
            className="h-10 w-full rounded-full border border-input bg-background pl-4 pr-10 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <Button variant="ghost" size="icon" className="hidden md:inline-flex">
          <MoreVertical className="size-5 text-muted-foreground" />
          <span className="sr-only">More</span>
        </Button>

        {walletLoading ? (
          <Skeleton className="hidden h-9 w-28 rounded-full md:block" />
        ) : (
          <div
            className="hidden items-center gap-2 rounded-full border border-input px-3 py-1.5 text-sm md:flex"
            title="Credits"
          >
            <Coins className="size-4 text-primary" />
            <span className="font-semibold text-foreground tabular-nums">
              {(wallet?.balance ?? 0).toLocaleString(
                locale === "vi" ? "vi-VN" : "en-US"
              )}
            </span>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </div>
        )}

        <Button
          variant="outline"
          className="hidden rounded-full px-4 text-sm font-medium md:inline-flex"
          asChild
        >
          <Link href="/pricing">Pricing</Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1 rounded-full border border-input bg-background p-1 transition-colors hover:bg-muted"
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
          <DropdownMenuContent align="end" className="w-44">
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
