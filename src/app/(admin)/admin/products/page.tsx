import { getProducts } from "./actions"
import { ProductsTable } from "@/components/admin/products-table"

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Produits</h1>
        <p className="text-sm text-neutral-500">
          Gérez votre catalogue de pâtisseries
        </p>
      </div>

      <ProductsTable products={products} />
    </div>
  )
}
