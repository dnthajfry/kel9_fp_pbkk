// app/api/upload/route.ts
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { randomUUID } from "crypto"

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get("file") as File

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const fileName = `${randomUUID()}-${file.name}`

  const { data, error } = await supabase.storage
    .from("covers")
    .upload(fileName, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    })

  if (error) {
    console.error(error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }

  const { data: urlData } = supabase.storage
    .from("covers")
    .getPublicUrl(fileName)

  return NextResponse.json({ url: urlData.publicUrl })
}
