import { getOrders } from "./actions"
import { OrdersView } from "@/components/admin/orders-view"

export default async function OrdersPage() {
  const orders = await getOrders()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Commandes</h1>
        <p className="text-sm text-neutral-500">
          Gérez et approuvez les commandes de vos clients
        </p>
      </div>

      <OrdersView orders={orders} />
    </div>
  )
}
