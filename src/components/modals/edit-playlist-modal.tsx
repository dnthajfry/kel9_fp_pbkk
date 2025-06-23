"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageIcon } from "lucide-react"
import Image from "next/image"

interface EditPlaylistModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  playlist?: {
    id: number
    name: string
    image?: string
  }
}

export function EditPlaylistModal({
  open,
  onOpenChange,
  playlist,
}: EditPlaylistModalProps) {
  const [playlistName, setPlaylistName] = useState(playlist?.name || "")
  const [imagePreview, setImagePreview] = useState(playlist?.image || "")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSave = async () => {
    if (!playlist) return
    setIsSaving(true)

    let imageUrl = playlist.image

    // Upload image to Supabase if changed
    if (selectedFile) {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadRes.ok) {
        console.error("Failed to upload image")
        setIsSaving(false)
        return
      }

      const { url } = await uploadRes.json()
      imageUrl = url
    }

    // Update playlist
    const updateRes = await fetch(`/api/playlists/${playlist.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: playlistName,
        coverUrl: imageUrl,
      }),
    })

    if (!updateRes.ok) {
      console.error("Failed to update playlist")
      setIsSaving(false)
      return
    }

    setIsSaving(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 text-white border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Playlist</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Picker */}
          <div className="flex items-center space-x-4">
            <label htmlFor="image-upload" className="cursor-pointer">
              <div className="w-32 h-32 bg-slate-700 rounded-lg overflow-hidden flex items-center justify-center hover:bg-slate-600 transition">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                    <span className="text-xs">Choose album cover</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                id="image-upload"
                onChange={handleImageChange}
                hidden
              />
            </label>

            {/* Playlist Name */}
            <div className="flex-1 space-y-2">
              <Label htmlFor="edit-playlist-name">Playlist Name</Label>
              <Input
                id="edit-playlist-name"
                placeholder="Enter playlist name"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-white text-black hover:bg-gray-200 rounded-full px-6"
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
