"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
Sidebar,
SidebarContent,
SidebarFooter,
SidebarGroup,
SidebarHeader,
} from "@/components/ui/sidebar"
import { HomeIcon, Library, Plus, Upload } from "lucide-react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { Separator } from "./ui/separator"
import { ScrollArea } from "./ui/scroll-area"
import { CreatePlaylistModal } from "./modals/create-playlist-modal"
import { UploadSongModal } from "./modals/upload-song-modal"
import Image from "next/image"

const sidebarPlaylists = [
    { name: "Running Playlist", href: "/playlist/running-playlist" },
    { name: "21st Birthday", href: "/playlist/21st-birthday" },
    { name: "April, 2023", href: "/playlist/april-2023" },
    { name: "Gym Session", href: "/playlist/gym-session" },
    { name: "Classic Anthems", href: "/playlist/classic-anthems" },
    { name: "R&B Favourites", href: "/playlist/rnb-favourites" },
    { name: "Classical Music", href: "/playlist/classical-music" },
    { name: "Hayleys Bday", href: "/playlist/hayleys-bday" },
    { name: "Discover Weekly", href: "/playlist/discover-weekly" },
    { name: "Liked From Radio", href: "/playlist/liked-from-radio" },
]


export function AppSidebar() {
    const [showCreatePlaylist, setShowCreatePlaylist] = useState(false)
    const [showUploadSong, setShowUploadSong] = useState(false)
    const pathname = usePathname()
    const router = useRouter()

    const navigationItems = [
        {
        name: "Home",
        href: "/",
        icon: HomeIcon,
        active: pathname === "/",
        },
        {
        name: "Your Library",
        href: "/library",
        icon: Library,
        active: pathname === "/library",
        },
    ]

    return (
        <>
            <Sidebar className="w-64 text-white h-screen flex flex-col p-4">
                <SidebarHeader>
                        {/* <Image
                            alt="foto"
                            src="/images/vercel.svg"
                            width={100}
                            height={100}
                            className="bg-black h-[500px] flex self-center"
                        /> */}
                <div className="space-y-2">
                    {navigationItems.map((item) => (
                    <Button
                        key={item.name}
                        variant="ghost"
                        className={cn(
                        "w-full justify-start text-gray-400 hover:text-white hover:bg-slate-800 cursor-pointer",
                        item.active && "text-blue-400 bg-slate-800"
                        )}
                        onClick={() => router.push(item.href)}
                    >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.name}
                    </Button>
                    ))}
                </div>
                </SidebarHeader>

                <SidebarContent className="flex-1">
                    <SidebarGroup>
                        <div className="space-y-2 mt-4">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-gray-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                            onClick={() => setShowCreatePlaylist(true)}
                        >
                            <Plus className="mr-3 h-5 w-5" />
                            Create Playlist
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-gray-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                            onClick={() => setShowUploadSong(true)}
                        >
                            <Upload className="mr-3 h-5 w-5" />
                            Upload Songs
                        </Button>
                        </div>
                    </SidebarGroup>

                    <Separator className="my-4 bg-slate-700" />

                    <SidebarGroup>
                        <ScrollArea className="h-[250px] pr-2">
                        <div className="space-y-1">
                            {sidebarPlaylists.map((playlist, index) => (
                            <Button
                                key={index}
                                variant="ghost"
                                className="w-full justify-start text-gray-400 hover:text-white hover:bg-slate-800 text-sm font-normal cursor-pointer"
                                onClick={() => router.push(playlist.href)}
                            >
                                {playlist.name}
                            </Button>
                            ))}
                        </div>
                        </ScrollArea>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                <p className="text-xs text-gray-500 text-center mt-4">© 2025 App Name</p>
                </SidebarFooter>
            </Sidebar>

            {/* Modals */}
            <CreatePlaylistModal
                open={showCreatePlaylist}
                onOpenChange={setShowCreatePlaylist}
            />
            <UploadSongModal
                open={showUploadSong}
                onOpenChange={setShowUploadSong}
            />
        </>
    )
}