// app/api/public-playlists/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const playlists = await prisma.playlist.findMany({
      orderBy: { id: "desc" },
      include: {
        user: true,
      },
    })

    return NextResponse.json(playlists)
  } catch (error) {
    console.error("GET /api/public-playlists error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
