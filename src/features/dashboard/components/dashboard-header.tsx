"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  X,
} from "lucide-react";
import {
  SearchDropdown,
  type SearchDropdownHandle,
} from "./command-palette";
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
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthStore, useLogout } from "@/features/auth";
import { BuyCreditsDialog } from "./buy-credits-dialog";
import { useWallet } from "../hooks";

export function DashboardHeader() {
  const [creditsMenuOpen, setCreditsMenuOpen] = useState(false);
  const [buyCreditsDialogOpen, setBuyCreditsDialogOpen] = useState(false);
  const [mobileSearchActive, setMobileSearchActive] = useState(false);
  const locale = useLocale();
  const tSidebar = useTranslations("dashboard.sidebar");
  const tHeaderMenu = useTranslations("dashboard.headerMenu");
  const user = useAuthStore((s) => s.user);
  const { logout } = useLogout();
  const { wallet, isLoading: walletLoading } = useWallet();

  // Ref to focus the desktop search bar programmatically
  const desktopSearchRef = useRef<SearchDropdownHandle>(null);

  // Cmd+K / Ctrl+K: focus desktop search or show mobile search
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      if (window.matchMedia("(min-width: 1024px)").matches) {
        desktopSearchRef.current?.focus();
      } else {
        setMobileSearchActive(true);
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-(--dashboard-header-height) items-center justify-between border-b border-border bg-background px-4 lg:px-6">
      {/* ── Logo ── */}
      <div className="flex min-w-0 items-center gap-2 md:gap-6">
        <SidebarTrigger className="md:hidden" />
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

      {/* ── Desktop search dropdown ── */}
      <div className="hidden flex-1 px-6 lg:block">
        <div className="mx-auto w-full max-w-md">
          <SearchDropdown ref={desktopSearchRef} />
        </div>
      </div>

      {/* ── Mobile search overlay (below header) ── */}
      {mobileSearchActive && (
        <div className="absolute inset-x-0 top-full z-40 border-b border-border bg-background px-4 py-2 lg:hidden">
          <SearchDropdown
            autoFocus
            onClose={() => setMobileSearchActive(false)}
          />
        </div>
      )}

      {/* ── Right section ── */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Mobile search icon */}
        {mobileSearchActive ? (
          <button
            type="button"
            onClick={() => setMobileSearchActive(false)}
            className="flex size-9 items-center justify-center rounded-full border border-input bg-background transition-colors hover:bg-muted lg:hidden"
          >
            <X className="size-4 text-muted-foreground" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setMobileSearchActive(true)}
            className="flex size-9 items-center justify-center rounded-full border border-input bg-background transition-colors hover:bg-muted lg:hidden"
          >
            <Search className="size-4 text-muted-foreground" />
          </button>
        )}

        {/* Credits balance */}
        {walletLoading ? (
          <Skeleton className="hidden h-9 w-28 rounded-full md:block" />
        ) : (
          <DropdownMenu open={creditsMenuOpen} onOpenChange={setCreditsMenuOpen}>
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
              <DropdownMenuItem
                onClick={() => {
                  setCreditsMenuOpen(false);
                  setBuyCreditsDialogOpen(true);
                }}
              >
                <Coins className="mr-2 size-4 text-primary" />
                {tHeaderMenu("buyMoreCredits")}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings?tab=billing">
                  <CreditCard className="mr-2 size-4" />
                  {tHeaderMenu("paymentHistory")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <BuyCreditsDialog
          open={buyCreditsDialogOpen}
          onOpenChange={setBuyCreditsDialogOpen}
        />

        {/* User avatar menu */}
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
