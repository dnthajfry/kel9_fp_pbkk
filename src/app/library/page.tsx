"use client";

import { useEffect, useState } from "react";
import PlaylistCard from "@/components/playlist-card";
import { usePlaylists } from "@/context/playlist-context";

export default function LibraryPage() {
  const { playlists, fetchPlaylists } = usePlaylists();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlaylists().finally(() => setLoading(false));
  }, [fetchPlaylists]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Library</h2>
      {loading ? (
        <p className="text-gray-400">Loading your playlists...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={{
                id: playlist.id,
                name: playlist.name,
                coverUrl: playlist.coverUrl,
              }}
            />
          ))}
        </div>
      )}
      {!loading && playlists.length === 0 && (
        <p className="text-gray-500">You haven't created any playlists yet.</p>
      )}
    </div>
  );
}
