import { ProductCard } from "./product-card"

type Product = {
  id: string
  name: string
  nameAr: string | null
  unit: "KG" | "PIECE"
  price: number
  stock: number
  images: string[]
  category: string | null
  occasion: string | null
}

type Occasion = {
  key: string
  label: string
  labelAr: string
  icon: string
  desc: string
}

const OCCASIONS: Occasion[] = [
  { key: "RAMADAN",  label: "Ramadan",      labelAr: "رمضان",     icon: "☪️", desc: "Spécialités de la saison sacrée" },
  { key: "WEDDING",  label: "Mariage",      labelAr: "عرس",       icon: "🌸", desc: "Sublimez vos célébrations" },
  { key: "BIRTHDAY", label: "Anniversaire", labelAr: "عيد ميلاد", icon: "🎂", desc: "Gâteaux et douceurs de fête" },
  { key: "AID",      label: "Aïd",          labelAr: "العيد",     icon: "✨", desc: "Pâtisseries traditionnelles de l'Aïd" },
]

function SectionHeading({ title, subtitle }: { title: string, subtitle?: string }) {
  return (
    <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "0.75rem" }}>
        <div style={{ height: "1px", width: "60px", background: "linear-gradient(to right, transparent, var(--gold))" }} />
        <span style={{ color: "var(--gold)", fontSize: "0.7rem", letterSpacing: "0.25em", fontWeight: 600, textTransform: "uppercase" }}>✦</span>
        <div style={{ height: "1px", width: "60px", background: "linear-gradient(to left, transparent, var(--gold))" }} />
      </div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "var(--warm-text)", margin: 0, lineHeight: 1.2 }}>{title}</h2>
      {subtitle && <p style={{ color: "var(--muted-text)", fontSize: "0.85rem", marginTop: "0.5rem" }}>{subtitle}</p>}
    </div>
  )
}

function OccasionCard({ occ }: { occ: Occasion }) {
  const href = "#occ-" + occ.key
  return (
    <a href={href} className="occasion-card" style={{ display: "block", borderRadius: "16px", padding: "1.75rem 1.25rem", textDecoration: "none", textAlign: "center" }}>
      <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem", lineHeight: 1 }}>{occ.icon}</div>
      <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: "var(--warm-text)", marginBottom: "3px", fontSize: "1rem" }}>{occ.label}</p>
      <p dir="rtl" style={{ color: "var(--gold)", fontSize: "0.82rem", marginBottom: "6px" }}>{occ.labelAr}</p>
      <p style={{ color: "var(--muted-text)", fontSize: "0.75rem", lineHeight: 1.5 }}>{occ.desc}</p>
    </a>
  )
}

function OccasionSection({ occ, products }: { occ: Occasion, products: Product[] }) {
  const sectionId = "occ-" + occ.key
  return (
    <section id={sectionId} style={{ padding: "3rem 1.5rem", maxWidth: "1100px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "2rem" }}>
        <span style={{ fontSize: "1.75rem" }}>{occ.icon}</span>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "var(--warm-text)", margin: 0, lineHeight: 1 }}>{occ.label}</h2>
          <span dir="rtl" style={{ color: "var(--gold)", fontSize: "0.85rem" }}>{occ.labelAr}</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.25rem" }}>
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      <hr className="gold-divider" style={{ marginTop: "3rem" }} />
    </section>
  )
}

function CustomCakeTeaser() {
  const boxStyle = { backgroundColor: "var(--espresso)", borderRadius: "20px", padding: "4rem 2rem", textAlign: "center" as const, position: "relative" as const, overflow: "hidden" as const, boxShadow: "0 20px 60px rgba(30,15,8,0.15)" }
  const linkStyle = { display: "inline-block", backgroundColor: "var(--gold)", color: "var(--espresso)", padding: "0.9rem 2.75rem", borderRadius: "8px", textDecoration: "none", fontWeight: 700, fontFamily: "'Playfair Display', serif", fontSize: "1rem", letterSpacing: "0.02em" }

  return (
    <section style={{ padding: "2rem 1.5rem 4rem", maxWidth: "1100px", margin: "0 auto" }}>
      <div className="pastry-pattern" style={boxStyle}>
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "240px", height: "240px", borderRadius: "50%", border: "1px solid rgba(201,146,42,0.15)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-80px", left: "-80px", width: "280px", height: "280px", borderRadius: "50%", border: "1px solid rgba(201,146,42,0.1)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", left: "-100px", transform: "translateY(-50%)", width: "200px", height: "200px", borderRadius: "50%", border: "1px solid rgba(201,146,42,0.08)", pointerEvents: "none" }} />

        <p style={{ color: "var(--gold)", fontSize: "0.72rem", letterSpacing: "0.25em", fontWeight: 600, textTransform: "uppercase", marginBottom: "1rem" }}>
          ✦ Création unique · صنع خاص ✦
        </p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "var(--gold-light)", marginBottom: "1rem", lineHeight: 1.2 }}>
          Votre gâteau sur mesure
        </h2>
        <p style={{ color: "rgba(253,246,227,0.65)", maxWidth: "520px", margin: "0 auto 2.5rem", lineHeight: 1.8, fontSize: "0.95rem" }}>
          Mariage, anniversaire, fiançailles — nous créons le gâteau qui correspond exactement à votre vision. Décrivez-nous votre rêve, nous le réalisons.
        </p>
        <a href="/custom-cake" style={linkStyle}>Faire une demande →</a>
        <p style={{ color: "rgba(253,246,227,0.35)", fontSize: "0.75rem", marginTop: "1.25rem", marginBottom: 0 }}>
          Devis gratuit · Réponse sous 24h
        </p>
      </div>
    </section>
  )
}

export function StorefrontHome({ products }: { products: Product[] }) {
  const byOccasion = (key: string) => products.filter((p) => p.occasion === key)
  const hasOccasions = OCCASIONS.some((occ) => byOccasion(occ.key).length > 0)

  return (
    <main>
      {/* Hero */}
      <section className="pastry-pattern" style={{ backgroundColor: "var(--cream-dark)", padding: "6rem 1.5rem 5rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "320px", height: "320px", borderRadius: "50%", border: "2px solid rgba(201,146,42,0.12)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-100px", left: "-100px", width: "380px", height: "380px", borderRadius: "50%", border: "2px solid rgba(201,146,42,0.08)", pointerEvents: "none" }} />

        <p style={{ color: "var(--gold)", fontSize: "0.72rem", letterSpacing: "0.3em", fontWeight: 600, textTransform: "uppercase", marginBottom: "1.25rem" }}>
          ✦ Pâtisserie artisanale tunisienne ✦
        </p>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 700, color: "var(--espresso)", lineHeight: 1.1, marginBottom: "1rem" }}>
          Des saveurs qui racontent
          <br />
          <span style={{ color: "var(--gold)", fontStyle: "italic" }}>notre héritage</span>
        </h1>

        <p dir="rtl" style={{ fontFamily: "'Lora', serif", color: "var(--muted-text)", fontSize: "1.15rem", marginBottom: "2.5rem" }}>
          حلويات تقليدية بلمسة أصيلة
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "2.5rem" }}>
          <div style={{ height: "1px", width: "80px", background: "linear-gradient(to right, transparent, var(--gold))" }} />
          <span style={{ color: "var(--gold)", fontSize: "0.7rem" }}>✦</span>
          <div style={{ height: "1px", width: "80px", background: "linear-gradient(to left, transparent, var(--gold))" }} />
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="#products" style={{ backgroundColor: "var(--espresso)", color: "var(--gold-light)", padding: "0.9rem 2.5rem", borderRadius: "8px", fontWeight: 700, textDecoration: "none", fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", letterSpacing: "0.02em", boxShadow: "0 4px 16px rgba(30,15,8,0.2)" }}>
            Commander maintenant
          </a>
          <a href="/cart" style={{ backgroundColor: "transparent", color: "var(--espresso)", padding: "0.9rem 2.5rem", borderRadius: "8px", fontWeight: 600, textDecoration: "none", fontFamily: "'Lora', serif", fontSize: "0.9rem", border: "2px solid var(--gold)" }}>
            Voir le panier
          </a>
        </div>
      </section>

      {/* Occasion collections — only show if any products have occasions tagged */}
      {hasOccasions && (
        <section style={{ padding: "4rem 1.5rem 2rem", backgroundColor: "var(--cream)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <SectionHeading title="Nos collections" subtitle="Des pâtisseries pour chaque moment de votre vie" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
              {OCCASIONS.map((occ) => {
                if (byOccasion(occ.key).length === 0) return null
                return <OccasionCard key={occ.key} occ={occ} />
              })}
            </div>
          </div>
        </section>
      )}

      {/* Per-occasion product sections */}
      {OCCASIONS.map((occ) => {
        const oProducts = byOccasion(occ.key)
        if (oProducts.length === 0) return null
        return <OccasionSection key={occ.key} occ={occ} products={oProducts} />
      })}

      {/* All products */}
      <section id="products" style={{ padding: "4rem 1.5rem", backgroundColor: "var(--cream-dark)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <SectionHeading
            title="Toutes nos pâtisseries"
            subtitle={products.length + " produit" + (products.length !== 1 ? "s" : "") + " disponible" + (products.length !== 1 ? "s" : "")}
          />
          {products.length === 0 ? (
            <p style={{ color: "var(--muted-text)", textAlign: "center", padding: "3rem 0" }}>
              Aucun produit disponible pour le moment.
            </p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      <CustomCakeTeaser />
    </main>
  )
}
