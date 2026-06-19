"use client"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/lib/cart-context"
import { ShoppingBag } from "lucide-react"

export function StorefrontNav() {
  const { totalItems } = useCart()
  const cartCount = Math.round(totalItems * 10) / 10

  return (
    <header style={{
      backgroundColor: "var(--espresso)",
      borderBottom: "2px solid var(--gold)",
      position: "sticky",
      top: 0,
      zIndex: 50,
      width: "100%",
    }}>
      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "0 1.5rem",
        height: "76px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
          <Image
            src="/caramel.jpg"
            alt="Caramel Pâtisserie"
            width={58}
            height={58}
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid var(--gold)",
              boxShadow: "0 2px 12px rgba(201,146,42,0.3)",
            }}
            priority
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{
              fontFamily: "'Caveat', cursive",
              fontWeight: 700,
              fontSize: "1.6rem",
              color: "var(--gold-light)",
              lineHeight: 1,
            }}>
              Caramel
            </span>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "0.7rem",
              fontWeight: 600,
              color: "var(--gold)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              lineHeight: 1,
            }}>
              Pâtisserie
            </span>
          </div>
        </Link>

        {/* Cart icon */}
        <Link
          href="/cart"
          style={{
            color: "var(--cream)",
            position: "relative",
            display: "flex",
            alignItems: "center",
            padding: "4px",
          }}>
          <ShoppingBag size={26} />
          {cartCount > 0 && (
            <span style={{
              position: "absolute",
              top: "-6px",
              right: "-6px",
              backgroundColor: "var(--gold)",
              color: "var(--espresso)",
              borderRadius: "999px",
              fontSize: "0.65rem",
              fontWeight: 800,
              minWidth: "18px",
              height: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 4px",
            }}>
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
