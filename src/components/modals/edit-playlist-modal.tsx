"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageIcon } from "lucide-react"
import Image from "next/image"

interface EditPlaylistModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  playlist?: {
    id: string
    name: string
    image?: string
  }
}

export function EditPlaylistModal({ open, onOpenChange, playlist }: EditPlaylistModalProps) {
  const [playlistName, setPlaylistName] = useState(playlist?.name || "")

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving playlist:", playlistName)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 text-white border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Playlist</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-32 h-32 bg-slate-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-600 transition-colors overflow-hidden">
              {playlist?.image ? (
                <Image
                  src={playlist.image || "/placeholder.svg"}
                  alt="Playlist cover"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <ImageIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <span className="text-xs text-gray-400">Choose album cover</span>
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="edit-playlist-name" className="text-sm font-medium">
                Playlist name
              </Label>
              <Input
                id="edit-playlist-name"
                placeholder="Playlist name"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-8" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
