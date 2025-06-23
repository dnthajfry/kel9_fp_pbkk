// app/api/playlists/[id]/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const playlist = await prisma.playlist.findUnique({
    where: { id: Number(params.id) },
    include: {
      playlistSongs: {
        include: {
          song: true,
        },
      },
      user: true, // <--- penting untuk mendapatkan email dan nama creator
    },
  });

  if (!playlist) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const response = {
    id: playlist.id,
    name: playlist.name,
    coverUrl: playlist.coverUrl,
    creator: playlist.user.name,
    creatorEmail: playlist.user.email, // <-- tambahkan ini untuk validasi owner di client
    songs: playlist.playlistSongs.map((ps) => ({
      id: ps.song.id,
      title: ps.song.title,
      artist: ps.song.artist,
      album: ps.song.album,
      coverUrl: ps.song.coverUrl,
      audioUrl: ps.song.audioUrl,
      duration: 0, // durasi tetap di frontend
    })),
  };

  return NextResponse.json(response);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const playlistId = Number(params.id)
  const { name, coverUrl } = await req.json()

  const user = await prisma.user.findFirst({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const playlist = await prisma.playlist.findUnique({
    where: { id: playlistId },
  })

  if (!playlist || playlist.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const updated = await prisma.playlist.update({
    where: { id: playlistId },
    data: { name, coverUrl },
  })

  return NextResponse.json(updated)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const playlistId = Number(params.id)

  const user = await prisma.user.findFirst({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const playlist = await prisma.playlist.findUnique({
    where: { id: playlistId },
  })

  if (!playlist || playlist.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // Hapus relasi playlist-song dulu
  await prisma.playlistSong.deleteMany({
    where: { playlistId },
  })

  // Hapus playlist
  await prisma.playlist.delete({
    where: { id: playlistId },
  })

  return NextResponse.json({ message: "Playlist deleted successfully" }, { status: 200 })
}
