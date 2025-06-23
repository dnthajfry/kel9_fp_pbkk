"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  audioUrl: string;
  coverUrl: string | null;
}

interface SongsContextType {
  songs: Song[];
  fetchSongs: () => Promise<void>;
}

const SongsContext = createContext<SongsContextType | undefined>(undefined);

export function SongsProvider({ children }: { children: React.ReactNode }) {
  const [songs, setSongs] = useState<Song[]>([]);

  const fetchSongs = useCallback(async () => {
    try {
      const res = await fetch("/api/songs");
      const data = await res.json();
      setSongs(data);
    } catch (err) {
      console.error("Failed to fetch songs", err);
    }
  }, []);

  return (
    <SongsContext.Provider value={{ songs, fetchSongs }}>
      {children}
    </SongsContext.Provider>
  );
}

export function useSongs() {
  const context = useContext(SongsContext);
  if (!context) {
    throw new Error("useSongs must be used within a SongsProvider");
  }
  return context;
}
