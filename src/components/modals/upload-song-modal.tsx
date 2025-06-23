"use client"

import { useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageIcon, Upload } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import { useSongs } from "@/context/songs-context"

interface UploadSongModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function UploadSongModal({ open, onOpenChange }: UploadSongModalProps) {
  const { fetchSongs } = useSongs()

  const [songTitle, setSongTitle] = useState("")
  const [songArtist, setSongArtist] = useState("")
  const [songAlbum, setSongAlbum] = useState("")
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async () => {
    if (!audioFile) return alert("Please select an audio file.")
    if (!songTitle || !songArtist || !songAlbum)
      return alert("Please fill in all song details.")

    try {
      // === Upload Audio ===
      const audioName = `audio-${Date.now()}-${audioFile.name}`
      const { data: audioData, error: audioError } = await supabase.storage
        .from("songs")
        .upload(audioName, audioFile)

      if (audioError || !audioData) throw new Error("Audio upload failed.")

      const { data: audioPublic } = supabase.storage
        .from("songs")
        .getPublicUrl(audioName)

      const audioUrl = audioPublic?.publicUrl
      if (!audioUrl) throw new Error("Failed to get audio URL.")

      // === Upload Cover ===
      let coverUrl = "/placeholder.svg"
      if (coverFile) {
        const coverName = `cover-${Date.now()}-${coverFile.name}`
        const { data: coverData, error: coverError } = await supabase.storage
          .from("covers")
          .upload(coverName, coverFile)

        if (coverError || !coverData) {
          console.warn("Cover upload failed. Using placeholder.")
        } else {
          const { data: coverPublic } = supabase.storage
            .from("covers")
            .getPublicUrl(coverName)

          if (coverPublic?.publicUrl) {
            coverUrl = coverPublic.publicUrl
          }
        }
      }

      // === Kirim ke API ===
      const res = await fetch("/api/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: songTitle,
          artist: songArtist,
          album: songAlbum,
          audioUrl,
          coverUrl,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || "Failed to save song to database.")
      }

      fetchSongs()
      setSongTitle("")
      setSongArtist("")
      setSongAlbum("")
      setAudioFile(null)
      setCoverFile(null)
      onOpenChange(false)
    } catch (err) {
      console.error("Upload failed:", err)
      alert("Upload failed. Please try again.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 text-white border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Upload Song</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            {/* Album Cover Upload */}
            <div
              className="w-32 h-32 bg-slate-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-600 transition-colors overflow-hidden"
              onClick={() => coverInputRef.current?.click()}
            >
              {coverFile ? (
                <img
                  src={URL.createObjectURL(coverFile)}
                  alt="Cover Preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="text-center">
                  <ImageIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <span className="text-xs text-gray-400">
                    Choose album cover
                  </span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                hidden
                ref={coverInputRef}
                onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              />
            </div>

            {/* Text Inputs */}
            <div className="flex-1 space-y-3">
              <div className="space-y-1">
                <Label htmlFor="song-title">Title</Label>
                <Input
                  id="song-title"
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  placeholder="Song title"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="song-artist">Artist</Label>
                <Input
                  id="song-artist"
                  value={songArtist}
                  onChange={(e) => setSongArtist(e.target.value)}
                  placeholder="Artist name"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="song-album">Album</Label>
                <Input
                  id="song-album"
                  value={songAlbum}
                  onChange={(e) => setSongAlbum(e.target.value)}
                  placeholder="Album name"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Audio Upload */}
          <div
            className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-slate-500 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <div className="text-gray-400 mb-1">Drag and Drop Audio</div>
            <div className="text-gray-500 text-sm mb-2">or</div>
            <Button variant="link" className="text-blue-400 p-0 h-auto">
              Browse
            </Button>
            <input
              type="file"
              accept="audio/*"
              hidden
              ref={fileInputRef}
              onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
            />
            {audioFile && (
              <div className="mt-3 text-sm text-gray-300">
                🎵 {audioFile.name} selected
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              className="bg-white text-black hover:bg-gray-200 rounded-full px-8"
              onClick={handleUpload}
            >
              Upload Song
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
