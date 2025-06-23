import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const songs = await prisma.song.findMany({
      orderBy: { id: "desc" },
      take: 8,
    })
    return NextResponse.json(songs)
  } catch (err) {
    console.error(err)
    return new NextResponse("Failed to fetch songs", { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findFirst({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const body = await req.json()
  const { title, artist, album, audioUrl, coverUrl } = body // ✅ ambil coverUrl dari body

  if (!title || !artist || !album || !audioUrl) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const song = await prisma.song.create({
    data: {
      title,
      artist,
      album,
      audioUrl,
      coverUrl: coverUrl || "/placeholder.svg", // ✅ gunakan coverUrl dari body jika ada
      uploadedById: user.id,
    },
  })

  return NextResponse.json(song, { status: 201 })
}