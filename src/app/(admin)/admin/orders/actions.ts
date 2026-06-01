"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  })

  return orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    status: o.status,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    customerAddress: o.customerAddress,
    customerCity: o.customerCity,
    customerWilaya: o.customerWilaya,
    fulfillmentType: o.fulfillmentType,
    fulfillmentDate: o.fulfillmentDate.toISOString(),
    deliveryZone: o.deliveryZone,
    deliveryFee: o.deliveryFee ? Number(o.deliveryFee) : null,
    totalAmount: Number(o.totalAmount),
    createdAt: o.createdAt.toISOString(),
    items: o.items.map((it) => ({
      id: it.id,
      productName: it.productName,
      unit: it.unit,
      quantity: Number(it.quantity),
      unitPrice: Number(it.unitPrice),
      lineTotal: Number(it.lineTotal),
      productId: it.productId,
    })),
  }))
}

// Approve an order — strict stock check, all-or-nothing
export async function approveOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  })

  if (!order) {
    return { ok: false, error: "Commande introuvable." }
  }
  if (order.status !== "PENDING") {
    return { ok: false, error: "Cette commande a déjà été traitée." }
  }

  // 1. Check stock for every item BEFORE touching anything
  const shortages: string[] = []
  for (const item of order.items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    })
    if (!product) {
      shortages.push(`${item.productName} (produit supprimé)`)
      continue
    }
    if (Number(product.stock) < Number(item.quantity)) {
      shortages.push(
        `${item.productName} : demandé ${Number(item.quantity)}, dispo ${Number(product.stock)}`
      )
    }
  }

  if (shortages.length > 0) {
    return {
      ok: false,
      error: "Stock insuffisant :\n" + shortages.join("\n"),
    }
  }

  // 2. All good — decrement stock and approve, in one transaction
  await prisma.$transaction([
    ...order.items.map((item) =>
      prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    ),
    prisma.order.update({
      where: { id: orderId },
      data: { status: "APPROVED" },
    }),
  ])

  revalidatePath("/admin/orders")
  revalidatePath("/admin/products")
  return { ok: true }
}

// Update status for the rest of the workflow (preparing, ready, delivered, cancelled)
export async function updateOrderStatus(
  orderId: string,
  status: "PREPARING" | "READY" | "DELIVERED" | "CANCELLED"
) {
  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  })
  revalidatePath("/admin/orders")
  return { ok: true }
}
