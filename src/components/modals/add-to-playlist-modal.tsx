import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { usePlaylists } from "@/context/playlist-context"
import { Button } from "@/components/ui/button"

interface AddToPlaylistModalProps {
  songId: number
  open: boolean
  onClose: () => void
}

export function AddToPlaylistModal({
  songId,
  open,
  onClose,
}: AddToPlaylistModalProps) {
  const { playlists, fetchPlaylists } = usePlaylists()

  const handleAdd = async (playlistId: number) => {
    try {
      await fetch("/api/playlist-songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songId, playlistId }),
      })
      onClose()
    } catch (err) {
      console.error("Failed to add song:", err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-white">
            Add to Playlist
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          {playlists.length === 0 ? (
            <p className="text-gray-400">You have no playlists yet.</p>
          ) : (
            playlists.map((playlist) => (
              <Button
                key={playlist.id}
                variant="ghost"
                className="w-full justify-start text-white hover:bg-slate-700"
                onClick={() => handleAdd(playlist.id)}
              >
                {playlist.name}
              </Button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
