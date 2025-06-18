"use client"

import PlaylistCard from "@/components/playlist-card"

const libraryPlaylists = [
  { id: "1", title: "Sybau", artist: "Shabilqis Naila", image: "/placeholder.svg?height=200&width=200" },
  { id: "2", title: "senja", artist: "Shabilqis Naila", image: "/placeholder.svg?height=200&width=200" },
  { id: "3", title: "ts pmo icl", artist: "Shabilqis Naila", image: "/placeholder.svg?height=200&width=200" },
  { id: "4", title: "fun", artist: "Shabilqis Naila", image: "/placeholder.svg?height=200&width=200" },
  { id: "5", title: "Playlist name", artist: "Shabilqis Naila", image: "/placeholder.svg?height=200&width=200" },
  { id: "6", title: "Playlist name", artist: "Shabilqis Naila", image: "/placeholder.svg?height=200&width=200" },
  { id: "7", title: "Playlist name", artist: "Shabilqis Naila", image: "/placeholder.svg?height=200&width=200" },
  { id: "8", title: "Playlist name", artist: "Shabilqis Naila", image: "/placeholder.svg?height=200&width=200" },
  { id: "9", title: "Playlist name", artist: "Shabilqis Naila", image: "/placeholder.svg?height=200&width=200" },
  { id: "10", title: "Playlist name", artist: "Shabilqis Naila", image: "/placeholder.svg?height=200&width=200" },
  { id: "11", title: "Playlist name", artist: "Shabilqis Naila", image: "/placeholder.svg?height=200&width=200" },
  { id: "12", title: "Playlist name", artist: "Shabilqis Naila", image: "/placeholder.svg?height=200&width=200" },
]

export default function LibraryPage() {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {libraryPlaylists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </div>
    </div>
  )
}
