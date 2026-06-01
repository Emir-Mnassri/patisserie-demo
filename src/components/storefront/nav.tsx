"use client"

import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { ShoppingBag } from "lucide-react"
import { useState, useEffect } from "react"

export function StorefrontNav() {
  const { totalItems } = useCart()
  const [lang, setLang] = useState<"fr" | "ar">("fr")

  useEffect(() => {
    const root = document.querySelector("[data-theme='pastry']") as HTMLElement | null
    if (!root) return
    root.setAttribute("dir", lang === "ar" ? "rtl" : "ltr")
  }, [lang])

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
        height: "70px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "3px" }}>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            color: "var(--gold-light)",
            fontSize: "1.35rem",
            fontWeight: 700,
            letterSpacing: "0.01em",
            lineHeight: 1,
            WebkitFontSmoothing: "antialiased",
          }}>
            Ma Pâtisserie
          </span>
          <span style={{
            color: "var(--gold)",
            fontSize: "0.8rem",
            fontWeight: 500,
            letterSpacing: "0.03em",
            lineHeight: 1,
            opacity: 0.85,
          }}>
            حلويات تونسية تقليدية
          </span>
        </Link>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>

          {/* Language toggle */}
          <button
            onClick={() => setLang((l) => l === "fr" ? "ar" : "fr")}
            style={{
              border: "1.5px solid var(--gold)",
              color: "var(--gold-light)",
              borderRadius: "6px",
              padding: "5px 14px",
              fontSize: "0.85rem",
              fontWeight: 600,
              background: "transparent",
              cursor: "pointer",
              letterSpacing: "0.05em",
              transition: "background 0.2s",
            }}>
            {lang === "fr" ? "عربي" : "FR"}
          </button>

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
            <ShoppingBag size={24} />
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
      </div>
    </header>
  )
}
