import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { playlistId, songId } = body;

    if (!playlistId || !songId) {
      return NextResponse.json({ error: "Missing playlistId or songId" }, { status: 400 });
    }

    // Cek apakah lagu sudah ada di playlist
    const exists = await prisma.playlistSong.findFirst({
      where: { playlistId, songId },
    });

    if (exists) {
      return NextResponse.json({ error: "Song already in playlist" }, { status: 409 });
    }

    const newEntry = await prisma.playlistSong.create({
      data: { playlistId, songId },
    });

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error("Add to playlist error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
