"use client"

import { usePathname } from "next/navigation"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/layout/top-bar"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const excludedRoutes = ["/login", "/not-found"]

  const isExcluded = excludedRoutes.includes(pathname)

  if (isExcluded) {
    return <>{children}</>
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full p-8">
        <SidebarTrigger />
        <div className="flex flex-col gap-8">
          <TopBar />
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
