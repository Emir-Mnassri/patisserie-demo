import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { customerName, customerPhone, occasion, eventDate, servings, message } = body

    if (!customerName || !customerPhone || !message) {
      return NextResponse.json({ error: "Nom, téléphone et description sont obligatoires." }, { status: 400 })
    }

    await prisma.customCakeRequest.create({
      data: {
        customerName,
        customerPhone,
        occasion: occasion || null,
        eventDate: eventDate ? new Date(eventDate) : null,
        servings: servings ? parseInt(servings) : null,
        message,
        status: "NEW",
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
