"use client"

import { usePathname } from "next/navigation"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/layout/top-bar"
import { SessionProvider } from "next-auth/react"
import { MusicPlayerProvider } from "@/context/music-player-context"
import AudioPlayer from "@/components/audio-player"
import { PlaylistProvider } from "@/context/playlist-context" // ✅ Tambahkan ini

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const excludedRoutes = ["/login", "/not-found"]
  const isExcluded = excludedRoutes.includes(pathname)

  if (isExcluded) {
    return <>{children}</>
  }

  return (
    <SessionProvider>
      <MusicPlayerProvider>
        <PlaylistProvider> {/* ✅ Bungkus di sini */}
          <SidebarProvider>
            <AppSidebar />
            <main className="w-full p-8 pb-32">
              <SidebarTrigger />
              <div className="flex flex-col gap-8">
                <TopBar />
                {children}
              </div>
            </main>
            <AudioPlayer />
          </SidebarProvider>
        </PlaylistProvider>
      </MusicPlayerProvider>
    </SessionProvider>
  )
}
