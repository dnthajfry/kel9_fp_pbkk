import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  const existingUser = await prisma.user.findFirst({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json({ error: "Email already in use" }, { status: 400 });
  }

  const user = await prisma.user.create({
    data: { name, email, password },
  });

  return NextResponse.json({ message: "User registered", user });
}
