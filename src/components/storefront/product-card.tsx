"use client"

import { useState } from "react"
import Image from "next/image"
import { useCart } from "@/lib/cart-context"
import { Check } from "lucide-react"

type Product = {
  id: string
  name: string
  nameAr: string | null
  unit: "KG" | "PIECE"
  price: number
  stock: number
  images: string[]
  category: string | null
}

const KG_OPTIONS = [0.25, 0.5, 1, 1.5, 2]

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()
  const [qty, setQty] = useState(product.unit === "KG" ? 0.5 : 1)
  const [added, setAdded] = useState(false)

  const outOfStock = product.stock <= 0
  const lineTotal = Math.round(qty * product.price * 1000) / 1000

  function handleAdd() {
    add({
      productId: product.id,
      productName: product.name,
      productNameAr: product.nameAr,
      unit: product.unit,
      quantity: qty,
      unitPrice: product.price,
      lineTotal,
      image: product.images[0] ?? null,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const cardStyle = {
    backgroundColor: "white",
    border: "1px solid var(--cream-dark)",
    borderRadius: "16px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column" as const,
    boxShadow: "0 2px 12px rgba(30,15,8,0.06)",
    transition: "box-shadow 0.25s, transform 0.25s",
  }

  return (
    <div className="product-card" style={cardStyle}>

      {/* Image area */}
      <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
        {product.images.length > 0 ? (
          <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <div style={{
            height: "100%",
            background: "linear-gradient(135deg, var(--gold-pale) 0%, var(--cream-dark) 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}>
            <span style={{ fontSize: "3rem", filter: "drop-shadow(0 2px 4px rgba(30,15,8,0.15))" }}>
              {product.unit === "KG" ? "🍯" : "🎂"}
            </span>
            <span style={{ fontSize: "0.7rem", color: "var(--muted-text)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>
              {product.category ?? "Pâtisserie"}
            </span>
          </div>
        )}

        {/* Category badge */}
        {product.category && (
          <div style={{
            position: "absolute", top: "10px", left: "10px",
            backgroundColor: "rgba(30,15,8,0.6)",
            color: "var(--gold-light)",
            fontSize: "0.65rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "3px 10px",
            borderRadius: "999px",
            backdropFilter: "blur(4px)",
          }}>
            {product.category}
          </div>
        )}

        {outOfStock && (
          <div style={{
            position: "absolute", inset: 0,
            backgroundColor: "rgba(30,15,8,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(2px)",
          }}>
            <span style={{ color: "white", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Rupture de stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.85rem" }}>

        {/* Name */}
        <div>
          <p className="product-name" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: "var(--warm-text)", lineHeight: 1.3, margin: 0 }}>
            {product.name}
          </p>
          {product.nameAr && (
            <p dir="rtl" style={{ color: "var(--muted-text)", fontSize: "0.8rem", marginTop: "3px", marginBottom: 0 }}>
              {product.nameAr}
            </p>
          )}
        </div>

        {/* Price */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
          <span className="product-price" style={{ fontFamily: "'Playfair Display', serif", color: "var(--gold)", fontWeight: 700, fontSize: "1.15rem" }}>
            {product.price.toFixed(3)} DT
          </span>
          <span style={{ color: "var(--muted-text)", fontSize: "0.78rem" }}>
            {product.unit === "KG" ? "/ kg" : "/ pièce"}
          </span>
        </div>

        {/* Quantity selector */}
        {!outOfStock && (
          <div>
            {product.unit === "KG" ? (
              <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                {KG_OPTIONS.map((opt) => (
                  <button key={opt} onClick={() => setQty(opt)} style={{
                    padding: "4px 11px",
                    borderRadius: "999px",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    border: qty === opt ? "1.5px solid var(--gold)" : "1.5px solid var(--cream-dark)",
                    backgroundColor: qty === opt ? "var(--gold-pale)" : "white",
                    color: qty === opt ? "var(--gold)" : "var(--muted-text)",
                    transition: "all 0.15s",
                    fontFamily: "'Lora', serif",
                  }}>
                    {opt < 1 ? (opt * 1000) + "g" : opt + " kg"}
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ width: "30px", height: "30px", borderRadius: "50%", border: "1.5px solid var(--cream-dark)", backgroundColor: "white", cursor: "pointer", fontWeight: 700, color: "var(--warm-text)", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                <span style={{ fontWeight: 600, minWidth: "24px", textAlign: "center", fontFamily: "'Playfair Display', serif" }}>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} style={{ width: "30px", height: "30px", borderRadius: "50%", border: "1.5px solid var(--cream-dark)", backgroundColor: "white", cursor: "pointer", fontWeight: 700, color: "var(--warm-text)", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                <span style={{ fontSize: "0.8rem", color: "var(--muted-text)", marginLeft: "4px" }}>{lineTotal.toFixed(3)} DT</span>
              </div>
            )}
          </div>
        )}

        {/* Add to cart button */}
        <button onClick={handleAdd} disabled={outOfStock} style={{
          marginTop: "auto",
          width: "100%",
          padding: "0.75rem",
          borderRadius: "10px",
          border: "none",
          cursor: outOfStock ? "not-allowed" : "pointer",
          backgroundColor: added ? "#3d6b41" : outOfStock ? "var(--cream-dark)" : "var(--espresso)",
          color: outOfStock ? "var(--muted-text)" : "var(--gold-light)",
          fontWeight: 700,
          fontSize: "0.85rem",
          fontFamily: "'Playfair Display', serif",
          letterSpacing: "0.02em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          transition: "background-color 0.2s",
        }}>
          {added ? (
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Check size={15} /> Ajouté au panier
            </span>
          ) : outOfStock ? (
            "Rupture de stock"
          ) : (
            "Ajouter au panier — " + lineTotal.toFixed(3) + " DT"
          )}
        </button>
      </div>
    </div>
  )
}
