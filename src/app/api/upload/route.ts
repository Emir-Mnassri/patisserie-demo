import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
  // Only logged-in admin can upload
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get("file") as File | null

  if (!file) {
    return NextResponse.json({ error: "Aucun fichier" }, { status: 400 })
  }

  // Validate type and size
  const allowed = ["image/jpeg", "image/png", "image/webp"]
  if (!allowed.includes(file.type)) {
    return NextResponse.json(
      { error: "Format non supporté (JPG, PNG ou WebP uniquement)" },
      { status: 400 }
    )
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Image trop volumineuse (max 5 Mo)" },
      { status: 400 }
    )
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Unique filename
  const ext = file.name.split(".").pop()
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const uploadDir = path.join(process.cwd(), "public", "uploads")
  await mkdir(uploadDir, { recursive: true })
  await writeFile(path.join(uploadDir, filename), buffer)

  // Public URL Next.js serves from /public
  return NextResponse.json({ url: `/uploads/${filename}` })
}
