"use client"

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer"

type OrderItem = {
  productName: string
  unit: "KG" | "PIECE"
  quantity: number
  lineTotal: number
}

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
  items: OrderItem[]
}

const BROWN = "#33100E"
const GOLD = "#C9922A"

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    borderBottom: `2 solid ${BROWN}`,
    paddingBottom: 12,
  },
  shopName: { fontSize: 18, fontFamily: "Helvetica-Bold", color: BROWN },
  slipTitle: { fontSize: 13, fontFamily: "Helvetica-Bold", textAlign: "right", color: BROWN },
  orderNum: { fontSize: 10, color: "#666", textAlign: "right", marginTop: 2 },
  section: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#666",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  bold: { fontFamily: "Helvetica-Bold" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1 solid #ccc",
    paddingBottom: 4,
    marginBottom: 4,
    fontFamily: "Helvetica-Bold",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 3,
    borderBottom: "0.5 solid #eee",
  },
  colName: { flex: 3 },
  colQty: { flex: 1, textAlign: "right" },
  colTotal: { flex: 1, textAlign: "right" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTop: `1 solid ${BROWN}`,
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: BROWN,
  },
  cod: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#FBF1E0",
    border: `1 solid ${GOLD}`,
  },
  codText: { fontFamily: "Helvetica-Bold", color: BROWN },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 9,
    color: "#999",
    textAlign: "center",
  },
})

function fmt(n: number) {
  return `${n.toFixed(3)} DT`
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

export function DeliveryPDF({
  order,
  shopName = "Caramel Pâtisserie",
}: {
  order: Order
  shopName?: string
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.shopName}>{shopName}</Text>
            <Text style={{ fontSize: 9, color: "#666", marginTop: 2 }}>
              Bon de livraison
            </Text>
          </View>
          <View>
            <Text style={styles.slipTitle}>
              {order.fulfillmentType === "DELIVERY" ? "LIVRAISON" : "RETRAIT"}
            </Text>
            <Text style={styles.orderNum}>{order.orderNumber}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client</Text>
          <Text style={styles.bold}>{order.customerName}</Text>
          <Text>{order.customerPhone}</Text>
          <Text>
            {order.customerAddress}, {order.customerCity}, {order.customerWilaya}
          </Text>
          {order.deliveryZone ? <Text>Zone : {order.deliveryZone}</Text> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {order.fulfillmentType === "DELIVERY"
              ? "Date de livraison"
              : "Date de retrait"}
          </Text>
          <Text style={styles.bold}>{fmtDate(order.fulfillmentDate)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Articles</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.colName}>Produit</Text>
            <Text style={styles.colQty}>Qté</Text>
            <Text style={styles.colTotal}>Total</Text>
          </View>
          {order.items.map((it, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colName}>{it.productName}</Text>
              <Text style={styles.colQty}>
                {it.quantity} {it.unit === "KG" ? "kg" : "pcs"}
              </Text>
              <Text style={styles.colTotal}>{fmt(it.lineTotal)}</Text>
            </View>
          ))}

          {order.deliveryFee ? (
            <View style={styles.tableRow}>
              <Text style={styles.colName}>Frais de livraison</Text>
              <Text style={styles.colQty}>—</Text>
              <Text style={styles.colTotal}>{fmt(order.deliveryFee)}</Text>
            </View>
          ) : null}

          <View style={styles.totalRow}>
            <Text>TOTAL À ENCAISSER</Text>
            <Text>{fmt(order.totalAmount)}</Text>
          </View>
        </View>

        <View style={styles.cod}>
          <Text style={styles.codText}>
            PAIEMENT À LA LIVRAISON — Encaisser {fmt(order.totalAmount)}
          </Text>
        </View>

        <Text style={styles.footer}>
          {shopName} — Bon généré le{" "}
          {new Date().toLocaleDateString("fr-FR")}
        </Text>
      </Page>
    </Document>
  )
}
