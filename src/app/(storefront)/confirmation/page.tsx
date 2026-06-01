"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense } from "react"

function ConfirmationContent() {
  const params = useSearchParams()
  const orderNumber = params.get("order")

  return (
    <div style={{ maxWidth: "560px", margin: "6rem auto", textAlign: "center", padding: "0 1.5rem" }}>
      <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✅</div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "var(--warm-text)", marginBottom: "0.75rem" }}>
        Commande confirmée !
      </h1>
      {orderNumber && (
        <p style={{ backgroundColor: "var(--gold-pale)", border: "1.5px solid var(--gold)", borderRadius: "8px", padding: "0.75rem 1.25rem", color: "var(--espresso-mid)", fontWeight: 600, marginBottom: "1.25rem", fontSize: "0.9rem" }}>
          Numéro de commande : {orderNumber}
        </p>
      )}
      <p style={{ color: "var(--muted-text)", lineHeight: 1.7, marginBottom: "0.75rem" }}>
        Merci pour votre commande. Nous vous contacterons par téléphone pour confirmer les détails et la date de livraison.
      </p>
      <p style={{ color: "var(--muted-text)", fontSize: "0.85rem", marginBottom: "2rem" }}>
        Paiement à la réception · Aucun montant débité maintenant.
      </p>
      <hr className="gold-divider" style={{ margin: "1.5rem 0" }} />
      <Link
        href="/"
        style={{ backgroundColor: "var(--espresso)", color: "var(--gold-light)", padding: "0.75rem 2rem", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontFamily: "'Lora', serif" }}>
        Retour à la boutique
      </Link>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense>
      <ConfirmationContent />
    </Suspense>
  )
}
