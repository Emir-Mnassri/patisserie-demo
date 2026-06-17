import { ReactNode } from "react"
import { CartProvider } from "@/lib/cart-context"
import { StorefrontNav } from "@/components/storefront/nav"

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
            padding: "2rem 1rem",
            fontSize: "0.8rem",
            marginTop: "4rem",
          }}
        >
          <p style={{ marginBottom: "0.5rem" }}>
            <span className="brand-script" style={{ color: "var(--gold-light)", fontSize: "1.5rem" }}>
              Caramel
            </span>{" "}
            <span style={{ color: "var(--gold-light)", fontFamily: "'Playfair Display', serif" }}>
              Pâtisserie
            </span>
          </p>
          <p>Livraison à domicile · Paiement à la réception · Sfax</p>
        </footer>
      </div>
    </CartProvider>
  )
}
