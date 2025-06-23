"use client"

import { createContext, useContext, useRef, useState } from "react"

export interface SongInfo {
  id: string
  title: string
  artist: string
  audioUrl: string
  coverUrl?: string
}

interface MusicPlayerContextValue {
  currentSong: SongInfo | null
  isPlaying: boolean
  playlist: SongInfo[] | null
  play: (song: SongInfo, playlist?: SongInfo[]) => void
  playPlaylist: (songs: SongInfo[]) => void
  togglePlayPause: () => void
  playNext: () => void
  playPrevious: () => void
  audioRef: React.RefObject<HTMLAudioElement | null>
  setCurrentSong: (song: SongInfo) => void
  setIsPlaying: (is: boolean) => void
}

const MusicPlayerContext = createContext<MusicPlayerContextValue | undefined>(undefined)

export const MusicPlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<SongInfo | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playlist, setPlaylist] = useState<SongInfo[] | null>(null)
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const audioRef = useRef<HTMLAudioElement>(null)

  const play = (song: SongInfo, playlist?: SongInfo[]) => {
    setCurrentSong(song)
    setIsPlaying(true)

    if (playlist) {
      setPlaylist(playlist)
      const index = playlist.findIndex((s) => s.id === song.id)
      setCurrentIndex(index !== -1 ? index : 0)
    } else {
      setPlaylist(null)
      setCurrentIndex(0)
    }
  }

  const playPlaylist = (songs: SongInfo[]) => {
    if (songs.length === 0) return
    play(songs[0], songs)
  }

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev)
  }

  const playNext = () => {
    if (!playlist) return

    const nextIndex = currentIndex + 1
    if (nextIndex < playlist.length) {
      const nextSong = playlist[nextIndex]
      setCurrentSong(nextSong)
      setCurrentIndex(nextIndex)
      setIsPlaying(true)
    }
  }

  const playPrevious = () => {
    if (!playlist) return

    const prevIndex = currentIndex - 1
    if (prevIndex >= 0) {
      const prevSong = playlist[prevIndex]
      setCurrentSong(prevSong)
      setCurrentIndex(prevIndex)
      setIsPlaying(true)
    }
  }

  const value: MusicPlayerContextValue = {
    currentSong,
    isPlaying,
    playlist,
    play,
    playPlaylist,
    togglePlayPause,
    playNext,
    playPrevious,
    audioRef,
    setCurrentSong,
    setIsPlaying,
  }

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  )
}

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext)
  if (!context) throw new Error("useMusicPlayer must be used within MusicPlayerProvider")
  return context
}
