"use client"

import { useEffect, useState } from "react"
import { useMusicPlayer } from "@/context/music-player-context"
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react"
import Image from "next/image"

export default function AudioPlayer() {
  const {
    currentSong,
    isPlaying,
    setIsPlaying,
    audioRef,
    playNext,
    playPrevious,
    playlist,
  } = useMusicPlayer()

  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error)
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, currentSong])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      if (!audio.duration) return
      const percent = (audio.currentTime / audio.duration) * 100
      setProgress(isNaN(percent) ? 0 : percent)
      setCurrentTime(audio.currentTime)
      setDuration(audio.duration)
    }

    audio.addEventListener("timeupdate", updateProgress)
    return () => audio.removeEventListener("timeupdate", updateProgress)
  }, [audioRef.current])

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    const audio = audioRef.current
    if (audio && audio.duration) {
      audio.currentTime = (value / 100) * audio.duration
      setProgress(value)
    }
  }

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    const audio = audioRef.current
    if (audio) {
      audio.volume = value
      setVolume(value)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60).toString().padStart(2, "0")
    return `${minutes}:${seconds}`
  }

  if (!currentSong) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 text-white px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_-1px_8px_rgba(0,0,0,0.3)] z-50">
      <audio ref={audioRef} src={currentSong.audioUrl} />

      {/* Song Info */}
      <div className="flex items-center gap-4 w-full md:w-1/3">
        <Image
          src={currentSong.coverUrl || "/placeholder.svg"}
          alt={currentSong.title}
          width={60}
          height={60}
          className="rounded-md object-cover"
        />
        <div className="truncate">
          <div className="font-semibold truncate">{currentSong.title}</div>
          <div className="text-sm text-gray-400 truncate">{currentSong.artist}</div>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex flex-col items-center w-full md:w-1/3">
        <div className="flex items-center gap-6">
          {playlist && playlist.length > 1 && (
            <button
              onClick={playPrevious}
              className="hover:text-green-400 transition-colors"
            >
              <SkipBack className="w-6 h-6" />
            </button>
          )}

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-white text-black hover:bg-gray-200 p-2 rounded-full transition-all"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>

          {playlist && playlist.length > 1 && (
            <button
              onClick={playNext}
              className="hover:text-green-400 transition-colors"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Seekbar with Time */}
        <div className="flex items-center gap-2 w-full mt-2 text-sm text-gray-300">
          <span className="w-10 text-right">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={handleSeek}
            className="w-full accent-green-500"
          />
          <span className="w-10 text-left">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-2 w-full md:w-1/3 justify-end">
        <Volume2 className="w-5 h-5" />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={handleVolume}
          className="accent-green-500 w-24"
        />
      </div>
    </div>
  )
}
