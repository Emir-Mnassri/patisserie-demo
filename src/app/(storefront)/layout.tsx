import { ReactNode } from "react"
import { CartProvider } from "@/lib/cart-context"
import { StorefrontNav } from "@/components/storefront/nav"
import Image from "next/image"

export default function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <div data-theme="pastry" style={{ minHeight: "100vh" }}>
        <StorefrontNav />
        {children}
        <footer
          style={{
            backgroundColor: "var(--espresso)",
            borderTop: "2px solid var(--gold)",
            color: "var(--muted-text)",
            textAlign: "center",
            padding: "2.5rem 1rem",
            fontSize: "0.8rem",
            marginTop: "4rem",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
            <Image
              src="/caramel.jpg"
              alt="Caramel Pâtisserie"
              width={72}
              height={72}
              style={{ borderRadius: "50%", border: "2px solid var(--gold)", objectFit: "cover" }}
            />
            <p style={{ color: "var(--muted-text)", margin: 0 }}>
              Livraison à domicile · Paiement à la réception · Sfax
            </p>
            <p style={{ color: "var(--gold)", opacity: 0.6, margin: 0, fontSize: "0.75rem" }}>
              © {new Date().getFullYear()} Caramel Pâtisserie
            </p>
          </div>
        </footer>
      </div>
    </CartProvider>
  )
}
