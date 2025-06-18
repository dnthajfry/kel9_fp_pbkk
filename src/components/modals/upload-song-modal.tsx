"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageIcon, Upload } from "lucide-react"

interface UploadSongModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UploadSongModal({ open, onOpenChange }: UploadSongModalProps) {
  const [songTitle, setSongTitle] = useState("")
  const [songArtist, setSongArtist] = useState("")
  const [songAlbum, setSongAlbum] = useState("")

  const handleUpload = () => {
    // Handle upload logic here
    console.log("Uploading song:", { songTitle, songArtist, songAlbum })
    onOpenChange(false)
    setSongTitle("")
    setSongArtist("")
    setSongAlbum("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 text-white border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Upload Song</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="w-32 h-32 bg-slate-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-600 transition-colors">
              <div className="text-center">
                <ImageIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <span className="text-xs text-gray-400">Choose album cover</span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="space-y-1">
                <Label htmlFor="song-title" className="text-sm font-medium">
                  Title
                </Label>
                <Input
                  id="song-title"
                  placeholder="Song title"
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="song-artist" className="text-sm font-medium">
                  Artist
                </Label>
                <Input
                  id="song-artist"
                  placeholder="Artist name"
                  value={songArtist}
                  onChange={(e) => setSongArtist(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="song-album" className="text-sm font-medium">
                  Album
                </Label>
                <Input
                  id="song-album"
                  placeholder="Album name"
                  value={songAlbum}
                  onChange={(e) => setSongAlbum(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-slate-500 transition-colors cursor-pointer">
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <div className="text-gray-400 mb-1">Drag and Drop Audio</div>
            <div className="text-gray-500 text-sm mb-2">or</div>
            <Button variant="link" className="text-blue-400 p-0 h-auto">
              Browse
            </Button>
          </div>

          <div className="flex justify-end">
            <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-8" onClick={handleUpload}>
              Upload Song
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
