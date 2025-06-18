"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeletePlaylistModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  playlistName?: string
}

export function DeletePlaylistModal({ open, onOpenChange, playlistName }: DeletePlaylistModalProps) {
  const handleDelete = () => {
    // Handle delete logic here
    console.log("Deleting playlist:", playlistName)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-black border-0 max-w-sm">
        <div className="text-center space-y-4 p-4">
          <h2 className="text-xl font-bold">Delete your playlist?</h2>
          <p className="text-gray-600">This will delete your playlist permanently</p>
          <div className="flex space-x-3 justify-center pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-8 border-gray-300 hover:bg-gray-50"
            >
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

