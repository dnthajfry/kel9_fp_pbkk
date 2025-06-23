import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Ambil playlist milik user yang sedang login
export async function GET() {
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

    const playlists = await prisma.playlist.findMany({
      where: { userId: user.id },
      orderBy: { id: "desc" },
    });

    return NextResponse.json(playlists, { status: 200 });
  } catch (error) {
    console.error("GET /api/playlists error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Buat playlist baru
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
    const { name, coverUrl } = body;

    if (!name) {
      return NextResponse.json({ error: "Missing playlist name" }, { status: 400 });
    }

    const playlist = await prisma.playlist.create({
      data: {
        name,
        coverUrl: coverUrl || "/placeholder.svg",
        userId: user.id,
      },
    });

    return NextResponse.json(playlist, { status: 201 });
  } catch (error) {
    console.error("POST /api/playlists error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: (error as any)?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
