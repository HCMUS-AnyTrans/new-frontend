"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Coins, ChevronDown, LogOut, User, Settings } from "lucide-react"
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
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  navGroups,
  mockUser,
  mockWallet,
} from "@/data/dashboard"

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      {/* Header - Logo */}
      <SidebarHeader className="p-4">
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
          <span className="text-lg font-bold text-primary group-data-[collapsible=icon]:hidden">
            AnyTrans
          </span>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Main Navigation */}
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <Link href={item.href}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
            {group.label === "Menu chính" && <SidebarSeparator className="mt-2" />}
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer - Credits & User */}
      <SidebarFooter>
        <SidebarSeparator />

        {/* Credit Balance */}
        <div className="flex items-center gap-2 rounded-lg bg-secondary/20 px-3 py-2 mx-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mx-0 group-data-[collapsible=icon]:px-2">
          <Coins className="size-4 shrink-0 text-secondary" />
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-xs text-muted-foreground">Credits</span>
            <span className="text-sm font-semibold text-foreground tabular-nums">
              {mockWallet.balance.toLocaleString("vi-VN")}
            </span>
          </div>
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-lg p-2 mx-2 text-left hover:bg-sidebar-accent transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mx-0"
            >
              <Avatar className="h-8 w-8 shrink-0">
                {mockUser.avatarUrl && (
                  <AvatarImage src={mockUser.avatarUrl} alt={mockUser.fullName} />
                )}
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {mockUser.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col min-w-0 group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium text-sidebar-foreground truncate">
                  {mockUser.fullName}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {mockUser.email}
                </span>
              </div>
              <ChevronDown className="size-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center">
                <User className="mr-2 size-4" />
                Hồ sơ
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center">
                <Settings className="mr-2 size-4" />
                Cài đặt
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 size-4" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
