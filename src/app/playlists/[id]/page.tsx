"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Play, Trash2, Pencil } from "lucide-react";
import { useMusicPlayer } from "@/context/music-player-context";
import { EditPlaylistModal } from "@/components/modals/edit-playlist-modal";
import { useSession } from "next-auth/react";

interface SongItem {
  id: number;
  title: string;
  artist: string;
  album: string;
  coverUrl?: string;
  audioUrl: string;
  duration: number;
}

interface PlaylistData {
  id: number;
  name: string;
  coverUrl?: string;
  creator: string;
  creatorEmail?: string; // optional untuk validasi kepemilikan
  createdDate: string;
  songs: SongItem[];
}

export default function PlaylistPage() {
  const pathname = usePathname();
  const router = useRouter();
  const id = Number(pathname.split("/").pop());
  const { play } = useMusicPlayer();
  const { data: session } = useSession();

  const [playlist, setPlaylist] = useState<PlaylistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const audioRefs = useRef<{ [key: number]: HTMLAudioElement }>({});

  const fetchPlaylist = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/playlists/${id}`);
      const data: PlaylistData = await res.json();

      data.songs.forEach((song) => {
        const audio = new Audio(song.audioUrl);
        audioRefs.current[song.id] = audio;
        audio.onloadedmetadata = () => {
          song.duration = audio.duration;
          setPlaylist((prev) => (prev ? { ...prev } : data));
        };
      });

      setPlaylist(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, [id]);

  const handlePlayPlaylist = () => {
    if (!playlist || playlist.songs.length === 0) return;
    const mappedSongs = playlist.songs.map((song) => ({
      id: String(song.id),
      title: song.title,
      artist: song.artist,
      audioUrl: song.audioUrl,
      coverUrl: song.coverUrl || "/placeholder.svg",
    }));
    play(mappedSongs[0], mappedSongs);
  };

  const handleDeletePlaylist = async () => {
    const confirmed = confirm("Are you sure you want to delete this playlist?");
    if (!confirmed) return;

    try {
      await fetch(`/api/playlists/${id}`, {
        method: "DELETE",
      });
      router.push("/");
    } catch (err) {
      console.error("Failed to delete playlist:", err);
      alert("Failed to delete playlist.");
    }
  };

  const handleDeleteSong = async (songId: number) => {
    // TODO: Implement delete song from playlist
    console.log("Delete song:", songId);
  };

  const isOwner = session?.user?.email === playlist?.creatorEmail;

  if (loading || !playlist)
    return <p className="text-gray-400">Loading playlist...</p>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end gap-6">
        <Image
          src={playlist.coverUrl || "/placeholder.svg"}
          alt={playlist.name}
          width={240}
          height={240}
          className="object-cover rounded-lg shadow-xl"
        />
        <div className="flex-1">
          <p className="text-sm text-gray-400 mb-2">
            Playlist • {playlist.songs.length} songs • Created by{" "}
            <span className="font-medium">{playlist.creator}</span>
          </p>
          <h1 className="text-5xl font-bold mb-2">{playlist.name}</h1>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayPlaylist}
              className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition"
            >
              <Play size={26} className="text-black" fill="currentColor" />
            </button>

            {isOwner && (
              <>
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="text-gray-400 hover:text-white transition flex items-center gap-1"
                >
                  <Pencil size={18} />
                  <span className="text-sm">Edit</span>
                </button>

                <button
                  onClick={handleDeletePlaylist}
                  className="text-red-400 hover:text-red-500 transition flex items-center gap-1"
                >
                  <Trash2 size={18} />
                  <span className="text-sm">Delete</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Songs Table */}
      <div className="text-sm">
        <div className="grid grid-cols-12 px-4 py-2 border-b border-gray-800 text-gray-400 uppercase tracking-wide font-medium">
          <div className="col-span-1">#</div>
          <div className="col-span-6">Title</div>
          <div className="col-span-3">Album</div>
          <div className="col-span-1">Time</div>
          <div className="col-span-1"></div>
        </div>

        {playlist.songs.map((song, i) => {
          const minutes = Math.floor(song.duration / 60);
          const seconds = Math.floor(song.duration % 60)
            .toString()
            .padStart(2, "0");

          return (
            <div
              key={song.id}
              className="grid grid-cols-12 px-4 py-2 rounded-md hover:bg-slate-800 group transition"
            >
              <div className="col-span-1 text-gray-400">{i + 1}</div>
              <div className="col-span-6 flex items-center gap-3 overflow-hidden">
                <Image
                  src={song.coverUrl || "/placeholder.svg"}
                  alt={song.title}
                  width={40}
                  height={40}
                  className="rounded object-cover"
                />
                <div className="truncate">
                  <p className="text-white font-medium truncate">
                    {song.title}
                  </p>
                  <p className="text-gray-400 text-xs truncate">
                    {song.artist}
                  </p>
                </div>
              </div>
              <div className="col-span-3 text-gray-400 truncate">
                {song.album}
              </div>
              <div className="col-span-1 text-gray-400">
                {minutes}:{seconds}
              </div>
              <div className="col-span-1 flex justify-end">
                <button
                  onClick={() => handleDeleteSong(song.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isOwner && (
        <EditPlaylistModal
          open={isEditOpen}
          onOpenChange={(open) => {
            setIsEditOpen(open);
            if (!open) fetchPlaylist(); // Refresh setelah edit
          }}
          playlist={{
            id: playlist.id,
            name: playlist.name,
            image: playlist.coverUrl,
          }}
        />
      )}
    </div>
  );
}
