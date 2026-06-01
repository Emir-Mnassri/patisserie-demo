"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  })

  // Decimal fields can't cross to client components as-is — convert to numbers
  return products.map((p) => ({
    id: p.id,
    name: p.name,
    nameAr: p.nameAr,
    unit: p.unit,
    price: Number(p.price),
    stock: Number(p.stock),
    category: p.category,
    occasion: p.occasion,
    isActive: p.isActive,
    images: p.images,
  }))
}

export type ProductInput = {
  name: string
  nameAr?: string
  description?: string
  unit: "KG" | "PIECE"
  price: number
  stock: number
  category?: string
  occasion?: "NONE" | "RAMADAN" | "AID" | "WEDDING" | "BIRTHDAY"
  isActive: boolean
  images?: string[]
}

export async function createProduct(data: ProductInput) {
  await prisma.product.create({
    data: {
      name: data.name,
      nameAr: data.nameAr || null,
      description: data.description || null,
      unit: data.unit,
      price: data.price,
      stock: data.stock,
      category: data.category || null,
      occasion: data.occasion ?? "NONE",
      isActive: data.isActive,
      images: data.images ?? [],
    },
  })
  revalidatePath("/admin/products")
}

export async function updateProduct(id: string, data: ProductInput) {
  await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      nameAr: data.nameAr || null,
      description: data.description || null,
      unit: data.unit,
      price: data.price,
      stock: data.stock,
      category: data.category || null,
      occasion: data.occasion ?? "NONE",
      isActive: data.isActive,
      images: data.images ?? [],
    },
  })
  revalidatePath("/admin/products")
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } })
  revalidatePath("/admin/products")
}
