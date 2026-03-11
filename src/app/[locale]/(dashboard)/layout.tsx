"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar, DashboardHeader } from "@/features/dashboard"
import { ProtectedRoute } from "@/features/auth"

function getSidebarDefaultOpen(): boolean {
  if (typeof document === "undefined") return true
  const match = document.cookie.match(/(?:^|;\s*)sidebar_state=([^;]*)/)
  if (!match) return true
  return match[1] === "true"
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [defaultOpen] = useState(getSidebarDefaultOpen)

  return (
    <ProtectedRoute>
      <SidebarProvider defaultOpen={defaultOpen}>
        <DashboardHeader />
        <AppSidebar />
        <SidebarInset className="h-svh overflow-hidden bg-muted/30">
          <main className="flex-1 overflow-y-auto bg-muted/30 pt-[var(--dashboard-header-height)] [scrollbar-gutter:stable]">
            <div className="px-4 md:px-(--dashboard-content-margin)">
              {children}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
