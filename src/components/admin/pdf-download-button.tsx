"use client"

import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
import { DeliveryPDF } from "./delivery-pdf"

// PDFDownloadLink can't be server-rendered — load it client-only
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
)

type Order = {
  orderNumber: string
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
  items: {
    productName: string
    unit: "KG" | "PIECE"
    quantity: number
    lineTotal: number
  }[]
}

export function PdfDownloadButton({ order }: { order: Order }) {
  return (
    <PDFDownloadLink
      document={<DeliveryPDF order={order} />}
      fileName={`bon-livraison-${order.orderNumber}.pdf`}
    >
      {({ loading }) => (
        <Button variant="secondary" disabled={loading} type="button">
          <FileDown className="mr-2 h-4 w-4" />
          {loading ? "Génération..." : "Bon de livraison (PDF)"}
        </Button>
      )}
    </PDFDownloadLink>
  )
}
