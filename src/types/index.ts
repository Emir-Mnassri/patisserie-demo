import { Prisma } from "@prisma/client"

export type ProductWithItems = Prisma.ProductGetPayload<{
include: { orderItems: true }
}>

export type OrderWithItems = Prisma.OrderGetPayload<{
include: {
items: {
include: { product: true }
}
}
}>

export type OrderStatus = "PENDING" | "APPROVED" | "SHIPPED" | "DELIVERED" | "CANCELLED"

export type AnalyticsPeriod = "day" | "month" | "year"
