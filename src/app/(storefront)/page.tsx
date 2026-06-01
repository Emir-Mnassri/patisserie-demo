import { prisma } from "@/lib/prisma"
import { StorefrontHome } from "@/components/storefront/storefront-home"

export default async function Page() {
  const raw = await prisma.product.findMany({
    where: { isActive: true, stock: { gt: 0 } },
    orderBy: { createdAt: "desc" },
  })

  const products = raw.map((p) => ({
    id: p.id,
    name: p.name,
    nameAr: p.nameAr,
    unit: p.unit as "KG" | "PIECE",
    price: Number(p.price),
    stock: Number(p.stock),
    images: p.images,
    category: p.category,
    occasion: p.occasion,
  }))

  return <StorefrontHome products={products} />
}
