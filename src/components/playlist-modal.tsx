"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import Image from "next/image"

interface PlaylistModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "edit" | "delete"
  playlist?: {
    id: string
    name: string
    image?: string
    songs?: number
  }
}

export function PlaylistModal({ isOpen, onClose, mode, playlist }: PlaylistModalProps) {
  const [playlistName, setPlaylistName] = useState(playlist?.name || "")

  const handleSave = () => {
    // Handle save logic here
    onClose()
    setPlaylistName("")
  }

  const handleDelete = () => {
    // Handle delete logic here
    onClose()
  }

  if (mode === "delete") {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white text-black border-0 max-w-sm">
          <div className="text-center space-y-4 p-4">
            <h2 className="text-xl font-bold">Delete your playlist?</h2>
            <p className="text-gray-600">This will delete your playlist permanently</p>
            <div className="flex space-x-3 justify-center">
              <Button variant="outline" onClick={onClose} className="px-8">
                Cancel
              </Button>
              <Button className="bg-red-500 hover:bg-red-600 text-white px-8" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 text-white border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {mode === "create" ? "Create Playlist" : "Edit Playlist"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-32 h-32 bg-slate-700 rounded-lg flex items-center justify-center">
              {playlist?.image ? (
                <Image
                  src={playlist.image || "/placeholder.svg"}
                  alt="Playlist cover"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-2 bg-slate-600 rounded flex items-center justify-center">
                    <Plus className="h-4 w-4" />
                  </div>
                  <span className="text-xs text-gray-400">Choose album cover</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <Input
                placeholder="Playlist name"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-8" onClick={handleSave}>
              {mode === "create" ? "Create" : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
