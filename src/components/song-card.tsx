"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Play, Plus } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useMusicPlayer } from "@/context/music-player-context"
import { AddToPlaylistModal } from "@/components/modals/add-to-playlist-modal" // ✅ Import

interface Song {
  id: string
  title: string
  artist: string
  image: string
  audioUrl?: string
  coverUrl?: string
}

interface SongCardProps {
  song: Song
}

export default function SongCard({ song }: SongCardProps) {
  const { setCurrentSong, setIsPlaying } = useMusicPlayer()

  const [showAddModal, setShowAddModal] = useState(false)

  const handlePlay = () => {
    setCurrentSong({
      id: song.id,
      title: song.title,
      artist: song.artist,
      audioUrl: song.audioUrl!,
      coverUrl: song.image,
    })
    setIsPlaying(true)
  }

  return (
    <>
      <div
        onClick={handlePlay}
        className="bg-slate-800 p-4 rounded-lg hover:bg-slate-700 transition-all duration-200 group cursor-pointer relative"
      >
        <div className="relative mb-4">
          <div className="aspect-square rounded-lg overflow-hidden">
            <Image
              src={song.image || "/placeholder.svg"}
              alt={song.title}
              width={200}
              height={200}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Tombol Play */}
          <Button
            size="icon"
            className="absolute bottom-2 right-2 bg-green-500 hover:bg-green-600 rounded-full shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation()
              handlePlay()
            }}
          >
            <Play className="h-4 w-4 text-black fill-black" />
          </Button>

          {/* Tombol Add to Playlist */}
          <Button
            size="icon"
            className="absolute top-2 right-2 bg-slate-700 hover:bg-slate-600 rounded-full shadow-md text-white opacity-0 group-hover:opacity-100 transition-all"
            onClick={(e) => {
              e.stopPropagation()
              setShowAddModal(true)
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <h3 className="font-semibold text-white mb-1 truncate">{song.title}</h3>
        <p className="text-gray-400 text-sm truncate">{song.artist}</p>
      </div>

      {/* Modal Add to Playlist */}
      <AddToPlaylistModal
        songId={parseInt(song.id)}
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </>
  )
}
