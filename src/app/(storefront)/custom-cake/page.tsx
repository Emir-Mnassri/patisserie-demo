"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const OCCASIONS = [
  { value: "Mariage", label: "💍 Mariage" },
  { value: "Anniversaire", label: "🎂 Anniversaire" },
  { value: "Fiançailles", label: "💐 Fiançailles" },
  { value: "Baptême", label: "👶 Baptême" },
  { value: "Autre", label: "✨ Autre occasion" },
]

export default function CustomCakePage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    occasion: "",
    eventDate: "",
    servings: "",
    message: "",
  })

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }))

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split("T")[0]

  async function handleSubmit() {
    if (!form.customerName || !form.customerPhone || !form.message) {
      setError("Veuillez remplir les champs obligatoires.")
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/custom-cake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Erreur lors de l'envoi.")
        return
      }
      setDone(true)
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

  if (done) {
    return (
      <div style={{ maxWidth: "520px", margin: "6rem auto", textAlign: "center", padding: "0 1.5rem" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎂</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "var(--warm-text)", marginBottom: "0.75rem" }}>
          Demande envoyée !
        </h1>
        <p style={{ color: "var(--muted-text)", lineHeight: 1.7, marginBottom: "2rem" }}>
          Nous avons bien reçu votre demande. Notre équipe vous contactera dans les plus brefs délais pour discuter de votre gâteau sur mesure.
        </p>
        <button
          onClick={() => router.push("/")}
          style={{ backgroundColor: "var(--espresso)", color: "var(--gold-light)", padding: "0.75rem 2rem", borderRadius: "8px", border: "none", fontWeight: 600, fontFamily: "'Lora', serif", cursor: "pointer", fontSize: "0.9rem" }}>
          Retour à la boutique
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", padding: "2.5rem 1.5rem 4rem" }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <p style={{ color: "var(--gold)", fontSize: "0.75rem", letterSpacing: "0.2em", fontWeight: 600, textTransform: "uppercase", marginBottom: "0.5rem" }}>
          ✦ Sur commande ✦
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", color: "var(--warm-text)", marginBottom: "0.75rem" }}>
          Votre gâteau sur mesure
        </h1>
        <p style={{ color: "var(--muted-text)", lineHeight: 1.7 }}>
          Décrivez-nous votre vision et nous vous recontacterons pour créer ensemble le gâteau de votre rêve.
        </p>
        <hr className="gold-divider" style={{ maxWidth: "120px", margin: "1.5rem auto 0" }} />
      </div>

      {/* Form */}
      <div style={{ backgroundColor: "white", border: "1px solid var(--cream-dark)", borderRadius: "16px", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* Contact */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Nom complet *</label>
            <input style={inputStyle} value={form.customerName} onChange={(e) => set("customerName", e.target.value)} placeholder="Votre nom" />
          </div>
          <div>
            <label style={labelStyle}>Téléphone *</label>
            <input style={inputStyle} type="tel" value={form.customerPhone} onChange={(e) => set("customerPhone", e.target.value)} placeholder="+216 XX XXX XXX" />
          </div>
        </div>

        {/* Occasion */}
        <div>
          <label style={labelStyle}>Occasion</label>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {OCCASIONS.map((occ) => (
              <button
                key={occ.value}
                onClick={() => set("occasion", occ.value)}
                style={{
                  padding: "5px 14px",
                  borderRadius: "999px",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  border: form.occasion === occ.value ? "1.5px solid var(--gold)" : "1.5px solid var(--cream-dark)",
                  backgroundColor: form.occasion === occ.value ? "var(--gold-pale)" : "transparent",
                  color: form.occasion === occ.value ? "var(--gold)" : "var(--muted-text)",
                  fontFamily: "'Lora', serif",
                  transition: "all 0.15s",
                }}>
                {occ.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date and servings */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Date de l'événement</label>
            <input style={inputStyle} type="date" min={minDate} value={form.eventDate} onChange={(e) => set("eventDate", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Nombre de personnes</label>
            <input style={inputStyle} type="number" min="1" value={form.servings} onChange={(e) => set("servings", e.target.value)} placeholder="ex: 30" />
          </div>
        </div>

        {/* Description */}
        <div>
          <label style={labelStyle}>Décrivez votre gâteau *</label>
          <textarea
            style={{ ...inputStyle, minHeight: "120px", resize: "vertical" }}
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder="Parfum, couleurs, thème, étages, inscriptions, allergies éventuelles..."
          />
        </div>

        {error && (
          <p style={{ padding: "0.75rem", backgroundColor: "#fef2f2", borderRadius: "8px", color: "#b91c1c", fontSize: "0.82rem", margin: 0 }}>
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            padding: "0.85rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "var(--espresso)",
            color: "var(--gold-light)",
            fontWeight: 700,
            fontSize: "0.95rem",
            fontFamily: "'Playfair Display', serif",
            cursor: submitting ? "not-allowed" : "pointer",
            transition: "background-color 0.2s",
          }}>
          {submitting ? "Envoi en cours..." : "Envoyer ma demande"}
        </button>

        <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--muted-text)", margin: 0 }}>
          Nous vous répondons sous 24h · Devis gratuit et sans engagement
        </p>
      </div>
    </div>
  )
}
