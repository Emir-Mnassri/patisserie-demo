"use client"

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
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
const BROWN_MID = "#5C2620"
const GOLD = "#C9922A"
const GOLD_LIGHT = "#E8B84B"
const CREAM = "#FDF6E3"
const CREAM_DARK = "#F0E2BB"

const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontSize: 11,
    fontFamily: "Helvetica",
    backgroundColor: CREAM,
  },
  headerBand: {
    backgroundColor: BROWN,
    padding: "28 40 20 40",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: `4 solid ${GOLD}`,
  },
  logoArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  shopNameBlock: {
    flexDirection: "column",
    gap: 4,
  },
  shopName: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: GOLD_LIGHT,
    letterSpacing: 1,
  },
  shopSub: {
    fontSize: 9,
    color: GOLD,
    letterSpacing: 2,
  },
  slipBadge: {
    backgroundColor: GOLD,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 4,
  },
  slipTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: BROWN,
    textAlign: "center",
    letterSpacing: 2,
  },
  orderNum: {
    fontSize: 9,
    color: GOLD,
    textAlign: "center",
    marginTop: 4,
  },
  body: {
    padding: "24 40",
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: GOLD,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 6,
    paddingBottom: 4,
    borderBottom: `1 solid ${CREAM_DARK}`,
  },
  bold: {
    fontFamily: "Helvetica-Bold",
    color: BROWN,
  },
  text: {
    color: BROWN_MID,
    fontSize: 11,
    marginBottom: 2,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: BROWN,
    padding: "6 8",
    borderRadius: 4,
    marginBottom: 4,
  },
  tableHeaderText: {
    fontFamily: "Helvetica-Bold",
    color: GOLD_LIGHT,
    fontSize: 10,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottom: `0.5 solid ${CREAM_DARK}`,
  },
  tableRowAlt: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: "#FAF0DC",
    borderBottom: `0.5 solid ${CREAM_DARK}`,
  },
  colName: { flex: 3 },
  colQty: { flex: 1, textAlign: "right" },
  colTotal: { flex: 1, textAlign: "right" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    padding: "10 12",
    backgroundColor: BROWN,
    borderRadius: 4,
  },
  totalLabel: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: GOLD_LIGHT,
    letterSpacing: 1,
  },
  totalAmount: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: GOLD_LIGHT,
  },
  cod: {
    marginTop: 20,
    padding: "12 16",
    backgroundColor: CREAM_DARK,
    border: `2 solid ${GOLD}`,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  codLabel: {
    fontFamily: "Helvetica-Bold",
    color: BROWN,
    fontSize: 11,
    letterSpacing: 1,
  },
  codAmount: {
    fontFamily: "Helvetica-Bold",
    color: GOLD,
    fontSize: 14,
  },
  footerBand: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: BROWN,
    borderTop: `2 solid ${GOLD}`,
    padding: "8 40",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLogoArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footerLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  footerText: {
    fontSize: 8,
    color: GOLD,
    opacity: 0.8,
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
  logoUrl = "https://patisserie-tn.vercel.app/caramel.jpg",
}: {
  order: Order
  shopName?: string
  logoUrl?: string
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header band with logo */}
        <View style={styles.headerBand}>
          <View style={styles.logoArea}>
            <Image style={styles.logoImage} src={logoUrl} />
            <View style={styles.shopNameBlock}>
              <Text style={styles.shopName}>{shopName}</Text>
              <Text style={styles.shopSub}>PÂTISSERIE EN LIGNE · SFAX</Text>
            </View>
          </View>
          <View>
            <View style={styles.slipBadge}>
              <Text style={styles.slipTitle}>
                {order.fulfillmentType === "DELIVERY" ? "BON DE LIVRAISON" : "BON DE RETRAIT"}
              </Text>
            </View>
            <Text style={styles.orderNum}>{order.orderNumber}</Text>
          </View>
        </View>

        {/* Body */}
        <View style={styles.body}>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations client</Text>
            <Text style={styles.bold}>{order.customerName}</Text>
            <Text style={styles.text}>{order.customerPhone}</Text>
            <Text style={styles.text}>
              {order.customerAddress}, {order.customerCity}, {order.customerWilaya}
            </Text>
            {order.deliveryZone
              ? <Text style={styles.text}>Zone : {order.deliveryZone}</Text>
              : null}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {order.fulfillmentType === "DELIVERY" ? "Date de livraison" : "Date de retrait"}
            </Text>
            <Text style={styles.bold}>{fmtDate(order.fulfillmentDate)}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Articles commandés</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.colName]}>Produit</Text>
              <Text style={[styles.tableHeaderText, styles.colQty]}>Qté</Text>
              <Text style={[styles.tableHeaderText, styles.colTotal]}>Total</Text>
            </View>
            {order.items.map((it, i) => (
              <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.text, styles.colName]}>{it.productName}</Text>
                <Text style={[styles.text, styles.colQty]}>
                  {it.quantity} {it.unit === "KG" ? "kg" : "pcs"}
                </Text>
                <Text style={[styles.text, styles.colTotal]}>{fmt(it.lineTotal)}</Text>
              </View>
            ))}

            {order.deliveryFee ? (
              <View style={styles.tableRow}>
                <Text style={[styles.text, styles.colName]}>Frais de livraison</Text>
                <Text style={[styles.text, styles.colQty]}>—</Text>
                <Text style={[styles.text, styles.colTotal]}>{fmt(order.deliveryFee)}</Text>
              </View>
            ) : null}

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL À ENCAISSER</Text>
              <Text style={styles.totalAmount}>{fmt(order.totalAmount)}</Text>
            </View>
          </View>

          <View style={styles.cod}>
            <Text style={styles.codLabel}>PAIEMENT À LA LIVRAISON</Text>
            <Text style={styles.codAmount}>{fmt(order.totalAmount)}</Text>
          </View>

        </View>

        {/* Footer band with small logo */}
        <View style={styles.footerBand} fixed>
          <View style={styles.footerLogoArea}>
            <Image style={styles.footerLogo} src={logoUrl} />
            <Text style={styles.footerText}>{shopName} — Sfax, Tunisie</Text>
          </View>
          <Text style={styles.footerText}>
            Bon généré le {new Date().toLocaleDateString("fr-FR")}
          </Text>
        </View>

      </Page>
    </Document>
  )
}
