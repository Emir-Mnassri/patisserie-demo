import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

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
  const base64 = buffer.toString("base64")
  const dataUri = `data:${file.type};base64,${base64}`

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "products",
    })
    return NextResponse.json({ url: result.secure_url })
  } catch (err) {
    console.error("Cloudinary upload error:", err)
    return NextResponse.json(
      { error: "Échec du téléchargement vers Cloudinary" },
      { status: 500 }
    )
  }
}
