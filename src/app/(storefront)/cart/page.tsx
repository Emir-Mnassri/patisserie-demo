"use client"

import { useCart } from "@/lib/cart-context"
import Image from "next/image"
import Link from "next/link"
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react"

export default function CartPage() {
  const { items, remove, clear, totalAmount } = useCart()

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: "600px", margin: "6rem auto", textAlign: "center", padding: "0 1.5rem" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🛒</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: "var(--warm-text)", marginBottom: "0.75rem" }}>
          Votre panier est vide
        </h1>
        <p style={{ color: "var(--muted-text)", marginBottom: "2rem" }}>
          Découvrez nos pâtisseries et ajoutez vos favoris.
        </p>
        <Link
          href="/"
          style={{ backgroundColor: "var(--espresso)", color: "var(--gold-light)", padding: "0.75rem 2rem", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontFamily: "'Lora', serif" }}>
          Voir la boutique
        </Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2.5rem 1.5rem 4rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "var(--warm-text)", margin: 0 }}>
          Votre panier
        </h1>
        <button
          onClick={clear}
          style={{ background: "none", border: "none", color: "var(--muted-text)", fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
          <Trash2 size={14} /> Vider le panier
        </button>
      </div>

      {/* Items */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
        {items.map((item) => (
          <div
            key={item.productId}
            style={{ backgroundColor: "white", border: "1px solid var(--cream-dark)", borderRadius: "12px", padding: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>

            {/* Image */}
            <div style={{ width: "72px", height: "72px", borderRadius: "8px", overflow: "hidden", backgroundColor: "var(--gold-pale)", flexShrink: 0, position: "relative" }}>
              {item.image ? (
                <Image src={item.image} alt={item.productName} fill className="object-cover" sizes="72px" />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem" }}>🍰</div>
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: "var(--warm-text)", margin: "0 0 2px", fontSize: "0.95rem" }}>
                {item.productName}
              </p>
              {item.productNameAr && (
                <p dir="rtl" style={{ color: "var(--muted-text)", fontSize: "0.78rem", margin: "0 0 6px" }}>
                  {item.productNameAr}
                </p>
              )}
              <p style={{ color: "var(--muted-text)", fontSize: "0.8rem", margin: 0 }}>
                {item.quantity} {item.unit === "KG" ? "kg" : "pcs"} × {item.unitPrice.toFixed(3)} DT
              </p>
            </div>

            {/* Line total + remove */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px", flexShrink: 0 }}>
              <p style={{ color: "var(--gold)", fontWeight: 700, fontSize: "1rem", margin: 0 }}>
                {item.lineTotal.toFixed(3)} DT
              </p>
              <button
                onClick={() => remove(item.productId)}
                style={{ background: "none", border: "none", color: "var(--muted-text)", cursor: "pointer", padding: 0 }}>
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={{ backgroundColor: "white", border: "1px solid var(--cream-dark)", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", color: "var(--muted-text)", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
          <span>{items.length} article{items.length > 1 ? "s" : ""}</span>
          <span>{totalAmount.toFixed(3)} DT</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.75rem", borderTop: "1px solid var(--cream-dark)" }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--warm-text)" }}>Total</span>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.3rem", color: "var(--gold)" }}>
            {totalAmount.toFixed(3)} DT
          </span>
        </div>
        <p style={{ fontSize: "0.78rem", color: "var(--muted-text)", marginTop: "0.5rem", marginBottom: 0 }}>
          Livraison calculée à l'étape suivante
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <Link
          href="/"
          style={{ flex: 1, textAlign: "center", padding: "0.75rem", borderRadius: "8px", border: "1.5px solid var(--espresso)", color: "var(--espresso)", textDecoration: "none", fontWeight: 600, fontFamily: "'Lora', serif", fontSize: "0.9rem" }}>
          Continuer les achats
        </Link>
        <Link
          href="/checkout"
          style={{ flex: 2, textAlign: "center", padding: "0.75rem", borderRadius: "8px", backgroundColor: "var(--espresso)", color: "var(--gold-light)", textDecoration: "none", fontWeight: 600, fontFamily: "'Lora', serif", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          Commander <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
