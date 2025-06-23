"use client"

import { useEffect, useState } from "react"
import { useSongs } from "@/context/songs-context"
import SongCard from "@/components/song-card"
import PlaylistCard from "@/components/playlist-card"

interface PublicPlaylist {
  id: number
  name: string
  coverUrl?: string
  user: {
    name: string
  }
}

export default function Home() {
  const { songs, fetchSongs } = useSongs()
  const [playlists, setPlaylists] = useState<PublicPlaylist[]>([])
  const [loadingSongs, setLoadingSongs] = useState(true)
  const [loadingPlaylists, setLoadingPlaylists] = useState(true)

  useEffect(() => {
    fetchSongs().finally(() => setLoadingSongs(false))

    fetch("/api/public-playlists")
      .then((res) => res.json())
      .then((data) => setPlaylists(data))
      .catch(console.error)
      .finally(() => setLoadingPlaylists(false))
  }, [fetchSongs])

  return (
    <div className="space-y-12">
      {/* Songs Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Songs For You</h2>
        {loadingSongs ? (
          <p className="text-gray-400">Loading songs...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {songs.map((song) => (
              <SongCard
                key={song.id}
                song={{
                  id: String(song.id),
                  title: song.title,
                  artist: song.artist,
                  image: song.coverUrl || "/placeholder.svg",
                  audioUrl: song.audioUrl,
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Playlists Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Playlists For You</h2>
        {loadingPlaylists ? (
          <p className="text-gray-400">Loading playlists...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {playlists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                playlist={{
                  id: playlist.id,
                  name: playlist.name,
                  coverUrl: playlist.coverUrl || "/placeholder.svg",
                }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
