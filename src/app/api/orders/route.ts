import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      orderNumber,
      customerName,
      customerPhone,
      customerAddress,
      customerCity,
      customerWilaya,
      fulfillmentType,
      fulfillmentDate,
      notes,
      totalAmount,
      items,
    } = body

    if (!customerName || !customerPhone || !fulfillmentDate || !items?.length) {
      return NextResponse.json({ error: "Données manquantes." }, { status: 400 })
    }

    const order = await prisma.order.create({
      data: {
        orderNumber,
        status: "PENDING",
        customerName,
        customerPhone,
        customerAddress: customerAddress || "Retrait en magasin",
        customerCity: customerCity || customerWilaya,
        customerWilaya,
        fulfillmentType,
        fulfillmentDate: new Date(fulfillmentDate),
        notes: notes || null,
        totalAmount,
        items: {
          create: items.map((item: {
            productId: string
            productName: string
            unit: string
            quantity: number
            unitPrice: number
            lineTotal: number
          }) => ({
            productId: item.productId,
            productName: item.productName,
            unit: item.unit,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.lineTotal,
          })),
        },
      },
    })

    return NextResponse.json({ orderNumber: order.orderNumber })
  } catch (err) {
    console.error("Order creation error:", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
