"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar, DashboardHeader } from "@/features/dashboard"
import { ProtectedRoute } from "@/features/auth"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <DashboardHeader />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="h-svh overflow-hidden bg-muted/30">
          <main className="flex-1 overflow-y-auto bg-muted/30 pt-[var(--dashboard-header-height)] [scrollbar-gutter:stable]">
            <div className="px-[var(--dashboard-content-margin)]">
              {children}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
