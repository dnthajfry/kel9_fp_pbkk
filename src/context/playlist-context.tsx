"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface Playlist {
  id: number;
  name: string;
  coverUrl?: string;
}

interface PlaylistContextValue {
  playlists: Playlist[];
  fetchPlaylists: () => Promise<void>;
}

const PlaylistContext = createContext<PlaylistContextValue | undefined>(undefined);

export const PlaylistProvider = ({ children }: { children: React.ReactNode }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const fetchPlaylists = useCallback(async () => {
    try {
      const res = await fetch("/api/playlists");
      if (!res.ok) {
        throw new Error(`Failed to fetch playlists: ${res.status}`);
      }
      const data = await res.json();
      setPlaylists(data);
    } catch (err) {
      console.error("Failed to fetch playlists:", err);
    }
  }, []);

  return (
    <PlaylistContext.Provider value={{ playlists, fetchPlaylists }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylists = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error("usePlaylists must be used within PlaylistProvider");
  }
  return context;
};
