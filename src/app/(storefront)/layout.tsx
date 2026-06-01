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
          <p style={{ color: "var(--gold-light)", fontFamily: "'Playfair Display', serif", marginBottom: "0.5rem" }}>
            Ma Pâtisserie
          </p>
          <p>Livraison à domicile · Paiement à la réception · Tunis</p>
        </footer>
      </div>
    </CartProvider>
  )
}
