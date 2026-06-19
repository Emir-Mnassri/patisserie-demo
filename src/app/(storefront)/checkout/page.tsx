"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import { generateOrderNumber } from "@/lib/utils"

const WILAYAS = [
  "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba",
  "Kairouan", "Kasserine", "Kébili", "Kef", "Mahdia", "Manouba", "Médenine",
  "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse",
  "Tataouine", "Tozeur", "Tunis", "Zaghouan"
]

export default function CheckoutPage() {
  const { items, totalAmount, clear } = useCart()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    customerCity: "",
    customerWilaya: "Tunis",
    fulfillmentType: "DELIVERY" as "DELIVERY" | "PICKUP",
    fulfillmentDate: "",
    notes: "",
  })

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }))

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split("T")[0]

  async function handleSubmit() {
    if (!form.customerName || !form.customerPhone || !form.customerAddress || !form.fulfillmentDate) {
      setError("Veuillez remplir tous les champs obligatoires.")
      return
    }
    if (items.length === 0) {
      setError("Votre panier est vide.")
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: generateOrderNumber(),
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          customerAddress: form.customerAddress,
          customerCity: form.customerCity || form.customerWilaya,
          customerWilaya: form.customerWilaya,
          fulfillmentType: form.fulfillmentType,
          fulfillmentDate: new Date(form.fulfillmentDate).toISOString(),
          notes: form.notes,
          totalAmount,
          items: items.map((i) => ({
            productId: i.productId,
            productName: i.productName,
            unit: i.unit,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            lineTotal: i.lineTotal,
          })),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Erreur lors de la commande.")
        return
      }

      const data = await res.json()
      clear()
      router.push("/confirmation?order=" + data.orderNumber)
    } finally {
      setSubmitting(false)
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "0.65rem 0.85rem",
    borderRadius: "8px",
    border: "1.5px solid var(--cream-dark)",
    backgroundColor: "white",
    fontFamily: "'Lora', serif",
    fontSize: "0.9rem",
    color: "var(--warm-text)",
    outline: "none",
    boxSizing: "border-box" as const,
  }

  const labelStyle = {
    display: "block",
    fontSize: "0.82rem",
    fontWeight: 600,
    color: "var(--espresso-mid)",
    marginBottom: "5px",
    letterSpacing: "0.03em",
  }

  const cardStyle = {
    backgroundColor: "white",
    border: "1px solid var(--cream-dark)",
    borderRadius: "12px",
    padding: "1.5rem",
  }

  return (
    <div style={{
      maxWidth: "960px",
      margin: "0 auto",
      padding: isMobile ? "1.5rem 1rem 4rem" : "2.5rem 1.5rem 4rem",
    }}>
      <h1 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: isMobile ? "1.5rem" : "2rem",
        color: "var(--warm-text)",
        margin: "0 0 1.5rem",
      }}>
        Finaliser la commande
      </h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "minmax(0,1.4fr) minmax(0,1fr)",
        gap: "2rem",
        alignItems: "start",
      }}>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Contact */}
          <div style={cardStyle}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "var(--warm-text)", margin: "0 0 1.25rem" }}>
              Vos coordonnées
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>Nom complet *</label>
                <input style={inputStyle} value={form.customerName} onChange={(e) => set("customerName", e.target.value)} placeholder="Mohamed Ben Ali" />
              </div>
              <div>
                <label style={labelStyle}>Téléphone *</label>
                <input style={inputStyle} type="tel" value={form.customerPhone} onChange={(e) => set("customerPhone", e.target.value)} placeholder="+216 XX XXX XXX" />
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div style={cardStyle}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "var(--warm-text)", margin: "0 0 1.25rem" }}>
              Livraison ou retrait
            </h2>
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem" }}>
              {(["DELIVERY", "PICKUP"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => set("fulfillmentType", type)}
                  style={{
                    flex: 1,
                    padding: "0.65rem",
                    borderRadius: "8px",
                    border: form.fulfillmentType === type ? "2px solid var(--gold)" : "1.5px solid var(--cream-dark)",
                    backgroundColor: form.fulfillmentType === type ? "var(--gold-pale)" : "transparent",
                    color: form.fulfillmentType === type ? "var(--gold)" : "var(--muted-text)",
                    fontWeight: 600,
                    fontFamily: "'Lora', serif",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}>
                  {type === "DELIVERY" ? "🚚 Livraison" : "🏪 Retrait"}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {form.fulfillmentType === "DELIVERY" && (
                <>
                  <div>
                    <label style={labelStyle}>Adresse *</label>
                    <input style={inputStyle} value={form.customerAddress} onChange={(e) => set("customerAddress", e.target.value)} placeholder="12 Rue de la Liberté" />
                  </div>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: "0.75rem",
                  }}>
                    <div>
                      <label style={labelStyle}>Ville</label>
                      <input style={inputStyle} value={form.customerCity} onChange={(e) => set("customerCity", e.target.value)} placeholder="Tunis" />
                    </div>
                    <div>
                      <label style={labelStyle}>Wilaya *</label>
                      <select style={inputStyle} value={form.customerWilaya} onChange={(e) => set("customerWilaya", e.target.value)}>
                        {WILAYAS.map((w) => <option key={w} value={w}>{w}</option>)}
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label style={labelStyle}>
                  {form.fulfillmentType === "DELIVERY" ? "Date de livraison souhaitée *" : "Date de retrait souhaitée *"}
                </label>
                <input
                  style={inputStyle}
                  type="date"
                  min={minDate}
                  value={form.fulfillmentDate}
                  onChange={(e) => set("fulfillmentDate", e.target.value)}
                />
              </div>

              <div>
                <label style={labelStyle}>Notes (optionnel)</label>
                <textarea
                  style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="Instructions spéciales, allergies..."
                />
              </div>
            </div>
          </div>

          {/* Payment notice */}
          <div style={{ backgroundColor: "var(--gold-pale)", border: "1.5px solid var(--gold)", borderRadius: "12px", padding: "1rem 1.25rem" }}>
            <p style={{ fontWeight: 700, color: "var(--espresso-mid)", margin: "0 0 4px", fontSize: "0.9rem" }}>
              💰 Paiement à la livraison
            </p>
            <p style={{ color: "var(--muted-text)", fontSize: "0.82rem", margin: 0 }}>
              Vous réglez en espèces à la réception de votre commande. Aucune carte requise.
            </p>
          </div>
        </div>

        {/* Order summary */}
        <div style={{ position: isMobile ? "static" : "sticky", top: "80px" }}>
          <div style={cardStyle}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "var(--warm-text)", margin: "0 0 1rem" }}>
              Récapitulatif
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1rem" }}>
              {items.map((item) => (
                <div key={item.productId} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                  <span style={{ color: "var(--warm-text)", flex: 1, marginRight: "0.5rem" }}>
                    {item.productName}
                    <span style={{ color: "var(--muted-text)" }}>
                      {" "}× {item.quantity}{item.unit === "KG" ? "kg" : "pcs"}
                    </span>
                  </span>
                  <span style={{ color: "var(--gold)", fontWeight: 600, flexShrink: 0 }}>
                    {item.lineTotal.toFixed(3)} DT
                  </span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid var(--cream-dark)", paddingTop: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "var(--warm-text)" }}>Total</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.2rem", color: "var(--gold)" }}>
                {totalAmount.toFixed(3)} DT
              </span>
            </div>

            {error && (
              <p style={{ marginTop: "0.75rem", padding: "0.75rem", backgroundColor: "#fef2f2", borderRadius: "8px", color: "#b91c1c", fontSize: "0.82rem" }}>
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting || items.length === 0}
              style={{
                marginTop: "1rem",
                width: "100%",
                padding: "0.85rem",
                borderRadius: "8px",
                border: "none",
                backgroundColor: submitting ? "var(--espresso-mid)" : "var(--espresso)",
                color: "var(--gold-light)",
                fontWeight: 700,
                fontSize: "0.95rem",
                fontFamily: "'Playfair Display', serif",
                cursor: submitting ? "not-allowed" : "pointer",
                transition: "background-color 0.2s",
              }}>
              {submitting ? "Envoi en cours..." : "Confirmer la commande"}
            </button>
            <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--muted-text)", marginTop: "0.5rem" }}>
              Paiement à la livraison · Sfax et environs
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
