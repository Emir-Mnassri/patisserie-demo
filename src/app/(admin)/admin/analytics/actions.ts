"use server"

import { prisma } from "@/lib/prisma"

export type Period = "day" | "month" | "year"

export async function getAnalytics(period: Period) {
  const now = new Date()

  let since: Date
  let groupFormat: string

  if (period === "day") {
    since = new Date(now)
    since.setDate(since.getDate() - 29)
    groupFormat = "DD Mon"
  } else if (period === "month") {
    since = new Date(now)
    since.setMonth(since.getMonth() - 11)
    since.setDate(1)
    groupFormat = "Mon YYYY"
  } else {
    since = new Date(now)
    since.setFullYear(since.getFullYear() - 4)
    since.setMonth(0, 1)
    groupFormat = "YYYY"
  }

  const revenueRaw = await prisma.$queryRawUnsafe<{ label: string; revenue: number; orders: number }[]>(
    `
    SELECT
      TO_CHAR("createdAt", '${groupFormat}') AS label,
      SUM("totalAmount")::float               AS revenue,
      COUNT(*)::int                            AS orders
    FROM "Order"
    WHERE status NOT IN ('PENDING', 'CANCELLED')
      AND "createdAt" >= $1
    GROUP BY label
    ORDER BY MIN("createdAt")
    `,
    since
  )

  const topProductsRaw = await prisma.$queryRaw<{ name: string; totalRevenue: number; totalQty: number }[]>`
    SELECT
      oi."productName"            AS name,
      SUM(oi."lineTotal")::float  AS "totalRevenue",
      SUM(oi.quantity)::float     AS "totalQty"
    FROM "OrderItem" oi
    JOIN "Order" o ON o.id = oi."orderId"
    WHERE o.status NOT IN ('PENDING', 'CANCELLED')
      AND o."createdAt" >= ${since}
    GROUP BY oi."productName"
    ORDER BY "totalRevenue" DESC
    LIMIT 6
  `

  const [totalRevenue, totalOrders, pendingCount] = await Promise.all([
    prisma.order.aggregate({
      where: {
        status: { notIn: ["PENDING", "CANCELLED"] },
        createdAt: { gte: since },
      },
      _sum: { totalAmount: true },
    }),
    prisma.order.count({
      where: {
        status: { notIn: ["PENDING", "CANCELLED"] },
        createdAt: { gte: since },
      },
    }),
    prisma.order.count({
      where: { status: "PENDING" },
    }),
  ])

  return {
    revenueChart: revenueRaw.map((r) => ({
      label: r.label,
      revenue: Number(r.revenue ?? 0),
      orders: Number(r.orders ?? 0),
    })),
    topProducts: topProductsRaw.map((p) => ({
      name: p.name,
      totalRevenue: Number(p.totalRevenue ?? 0),
      totalQty: Number(p.totalQty ?? 0),
    })),
    summary: {
      totalRevenue: Number(totalRevenue._sum.totalAmount ?? 0),
      totalOrders,
      pendingCount,
    },
  }
}
