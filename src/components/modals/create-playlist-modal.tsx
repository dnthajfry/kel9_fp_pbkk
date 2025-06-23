"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

interface CreatePlaylistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateSuccess?: () => void; // ✅ untuk trigger fetchPlaylists di luar
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function CreatePlaylistModal({
  open,
  onOpenChange,
  onCreateSuccess,
}: CreatePlaylistModalProps) {
  const [playlistName, setPlaylistName] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleCreate = async () => {
    if (!playlistName.trim()) return alert("Playlist name is required.");
    setIsLoading(true);

    try {
      let coverUrl = "/placeholder.svg";

      if (coverFile) {
        const filename = `playlist-${Date.now()}-${coverFile.name}`;
        const { error } = await supabase.storage
          .from("covers")
          .upload(filename, coverFile);

        if (error) {
          console.error("Cover upload error:", error);
          alert("Failed to upload cover. Using placeholder.");
        } else {
          const { data: publicData } = supabase.storage
            .from("covers")
            .getPublicUrl(filename);
          coverUrl = publicData?.publicUrl || coverUrl;
        }
      }

      const res = await fetch("/api/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: playlistName, coverUrl }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Create playlist error:", err);
        alert("Failed to create playlist: " + (err.error || "Unknown error"));
        return;
      }

      // ✅ Trigger update playlist dari luar (misalnya page.tsx)
      if (onCreateSuccess) {
        onCreateSuccess();
      }

      setPlaylistName("");
      setCoverFile(null);
      onOpenChange(false);
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 text-white border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create Playlist</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div
              className="w-32 h-32 bg-slate-700 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden hover:bg-slate-600"
              onClick={() => coverInputRef.current?.click()}
            >
              {coverFile ? (
                <Image
                  src={URL.createObjectURL(coverFile)}
                  alt="Playlist Cover"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-2 bg-slate-600 rounded flex items-center justify-center">
                    <Plus className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs text-gray-400">Choose cover</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                hidden
                ref={coverInputRef}
                onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              />
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
            <Button
              className="bg-white text-black hover:bg-gray-200 rounded-full px-8"
              onClick={handleCreate}
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
