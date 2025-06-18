"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface Playlist {
  id: string
  title: string
  artist: string
  image: string
}

interface PlaylistCardProps {
  playlist: Playlist
}

export default function PlaylistCard({ playlist }: PlaylistCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="bg-slate-800 p-4 rounded-lg hover:bg-slate-700 transition-all duration-200 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative mb-4">
        <div className="aspect-square bg-gray-600 rounded-lg overflow-hidden">
          <Image
            src={playlist.image || "/placeholder.svg"}
            alt={playlist.title}
            width={200}
            height={200}
            className="w-full h-full object-cover"
          />
        </div>
        <Button
          size="icon"
          className={cn(
            "absolute bottom-2 right-2 bg-green-500 hover:bg-green-600 rounded-full shadow-lg transition-all duration-200",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
          )}
        >
          <Play className="h-4 w-4 text-black fill-black" />
        </Button>
      </div>
      <h3 className="font-semibold text-white mb-1 truncate">{playlist.title}</h3>
      <p className="text-gray-400 text-sm truncate">{playlist.artist}</p>
    </div>
  )
}
