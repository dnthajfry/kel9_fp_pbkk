"use client"

import PlaylistCard from "@/components/playlist-card"
import SongCard from "@/components/song-card"


const songsForYou = [
  {
    id: "1",
    title: "Snooze",
    artist: "SOS • SZA",
    image: "/placeholder.svg?height=200&width=200",
    color: "bg-blue-500",
  },
  {
    id: "2",
    title: "NEW MAGIC WAND",
    artist: "IGOR • Tyler, The Creator",
    image: "/placeholder.svg?height=200&width=200",
    color: "bg-pink-400",
  },
  {
    id: "3",
    title: "Ghost Town",
    artist: "ye • Kanye West",
    image: "/placeholder.svg?height=200&width=200",
    color: "bg-green-600",
  },
  {
    id: "4",
    title: "OLYMPIAN",
    artist: "MUSIC • Playboi Carti",
    image: "/placeholder.svg?height=200&width=200",
    color: "bg-gray-200",
  },
]

const playlists = [
  {
    id: "1",
    title: "Sybau",
    artist: "Shabilqis Naila",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "2",
    title: "senja",
    artist: "Dentha Jefry",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "3",
    title: "ts pmo icl",
    artist: "Lucky Virgiawan",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "4",
    title: "fun",
    artist: "Jasmine Aziza",
    image: "/placeholder.svg?height=200&width=200",
  },
]

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Songs For You Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Songs For You</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {songsForYou.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </section>

      {/* Playlist Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Playlist</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </section>
    </div>
  )
}