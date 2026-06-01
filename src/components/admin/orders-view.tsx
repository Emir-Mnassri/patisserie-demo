"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { approveOrder, updateOrderStatus } from "@/app/(admin)/admin/orders/actions"
import { formatTND } from "@/lib/utils"
import { Check, Truck, Store } from "lucide-react"
import { PdfDownloadButton } from "./pdf-download-button"

type OrderItem = {
  id: string
  productName: string
  unit: "KG" | "PIECE"
  quantity: number
  unitPrice: number
  lineTotal: number
  productId: string
}

type Order = {
  id: string
  orderNumber: string
  status: string
  customerName: string
  customerPhone: string
  customerAddress: string
  customerCity: string
  customerWilaya: string
  fulfillmentType: "DELIVERY" | "PICKUP"
  fulfillmentDate: string
  deliveryZone: string | null
  deliveryFee: number | null
  totalAmount: number
  createdAt: string
  items: OrderItem[]
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  APPROVED: "Approuvée",
  PREPARING: "En préparation",
  READY: "Prête",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
}

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "outline",
  APPROVED: "default",
  PREPARING: "secondary",
  READY: "secondary",
  DELIVERED: "default",
  CANCELLED: "destructive",
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export function OrdersView({ orders }: { orders: Order[] }) {
  const [selected, setSelected] = useState<Order | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleApprove(id: string) {
    setBusy(true)
    setError(null)
    try {
      const res = await approveOrder(id)
      if (!res.ok) {
        setError(res.error ?? "Échec de l'approbation.")
      } else {
        setSelected(null)
      }
    } finally {
      setBusy(false)
    }
  }

  async function handleStatus(
    id: string,
    status: "PREPARING" | "READY" | "DELIVERED" | "CANCELLED"
  ) {
    setBusy(true)
    try {
      await updateOrderStatus(id, status)
      setSelected(null)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Commande</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Pour le</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-neutral-500">
                  Aucune commande.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((o) => (
                <TableRow
                  key={o.id}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelected(o)
                    setError(null)
                  }}
                >
                  <TableCell className="font-medium">{o.orderNumber}</TableCell>
                  <TableCell>{o.customerName}</TableCell>
                  <TableCell>{fmtDate(o.fulfillmentDate)}</TableCell>
                  <TableCell>
                    {o.fulfillmentType === "DELIVERY" ? "Livraison" : "Retrait"}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatTND(o.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[o.status]}>
                      {STATUS_LABELS[o.status]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Order detail */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selected.orderNumber}
                  <Badge variant={STATUS_VARIANT[selected.status]}>
                    {STATUS_LABELS[selected.status]}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 text-sm">
                {/* Customer */}
                <div className="rounded-md bg-neutral-50 p-3">
                  <p className="font-medium">{selected.customerName}</p>
                  <p className="text-neutral-600">{selected.customerPhone}</p>
                  <p className="text-neutral-600">
                    {selected.customerAddress}, {selected.customerCity},{" "}
                    {selected.customerWilaya}
                  </p>
                  <p className="mt-2 flex items-center gap-1 text-neutral-600">
                    {selected.fulfillmentType === "DELIVERY" ? (
                      <Truck className="h-4 w-4" />
                    ) : (
                      <Store className="h-4 w-4" />
                    )}
                    {selected.fulfillmentType === "DELIVERY"
                      ? "Livraison"
                      : "Retrait en magasin"}{" "}
                    — {fmtDate(selected.fulfillmentDate)}
                    {selected.deliveryZone ? ` (${selected.deliveryZone})` : ""}
                  </p>
                </div>

                {/* Items */}
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produit</TableHead>
                        <TableHead className="text-right">Qté</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selected.items.map((it) => (
                        <TableRow key={it.id}>
                          <TableCell>{it.productName}</TableCell>
                          <TableCell className="text-right">
                            {it.quantity} {it.unit === "KG" ? "kg" : "pcs"}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatTND(it.lineTotal)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {selected.deliveryFee ? (
                  <div className="flex justify-between text-neutral-600">
                    <span>Frais de livraison</span>
                    <span>{formatTND(selected.deliveryFee)}</span>
                  </div>
                ) : null}

                <div className="flex justify-between border-t pt-2 text-base font-semibold">
                  <span>Total</span>
                  <span>{formatTND(selected.totalAmount)}</span>
                </div>

                {error && (
                  <p className="whitespace-pre-line rounded-md bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </p>
                )}

                {/* Actions depend on status */}
                <div className="flex flex-wrap justify-end gap-2 border-t pt-3">
                  {selected.status !== "PENDING" &&
                    selected.status !== "CANCELLED" && (
                      <PdfDownloadButton order={selected} />
                    )}
                  {selected.status === "PENDING" && (
                    <Button
                      onClick={() => handleApprove(selected.id)}
                      disabled={busy}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      {busy ? "Traitement..." : "Approuver (mettre à jour le stock)"}
                    </Button>
                  )}
                  {selected.status === "APPROVED" && (
                    <Button
                      variant="secondary"
                      onClick={() => handleStatus(selected.id, "PREPARING")}
                      disabled={busy}
                    >
                      Marquer en préparation
                    </Button>
                  )}
                  {selected.status === "PREPARING" && (
                    <Button
                      variant="secondary"
                      onClick={() => handleStatus(selected.id, "READY")}
                      disabled={busy}
                    >
                      Marquer prête
                    </Button>
                  )}
                  {selected.status === "READY" && (
                    <Button
                      onClick={() => handleStatus(selected.id, "DELIVERED")}
                      disabled={busy}
                    >
                      Marquer livrée
                    </Button>
                  )}
                  {["PENDING", "APPROVED"].includes(selected.status) && (
                    <Button
                      variant="outline"
                      onClick={() => handleStatus(selected.id, "CANCELLED")}
                      disabled={busy}
                    >
                      Annuler
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
