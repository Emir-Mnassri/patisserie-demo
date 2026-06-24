"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import {
  LayoutDashboard,
  Cake,
  ShoppingBag,
  MessageSquare,
} from "lucide-react"

const navItems = [
  { href: "/admin/products", label: "Produits", icon: Cake },
  { href: "/admin/orders", label: "Commandes", icon: ShoppingBag, badge: true },
  { href: "/admin/requests", label: "Demandes sur mesure", icon: MessageSquare },
  { href: "/admin/analytics", label: "Analytiques", icon: LayoutDashboard },
]

export function Sidebar() {
  const pathname = usePathname()
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    async function fetchPending() {
      try {
        const res = await fetch("/api/admin/pending-count")
        const data = await res.json()
        setPendingCount(data.count ?? 0)
      } catch {
        // silently fail
      }
    }
    fetchPending()
    const interval = setInterval(fetchPending, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <nav className="flex flex-col gap-1 p-3">
      {navItems.map((item) => {
        const Icon = item.icon
        const active = pathname.startsWith(item.href)
        const showBadge = item.badge && pendingCount > 0

        return (
          <Link
            key={item.href}
            href={item.href}
            style={active ? {
              backgroundColor: "#33100E",
              color: "#E8B84B",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              borderRadius: "8px",
              padding: "10px 12px",
              fontSize: "0.875rem",
              fontWeight: 600,
              textDecoration: "none",
              transition: "all 0.2s",
              position: "relative",
            } : {
              backgroundColor: "transparent",
              color: "#5C2620",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              borderRadius: "8px",
              padding: "10px 12px",
              fontSize: "0.875rem",
              fontWeight: 500,
              textDecoration: "none",
              transition: "all 0.2s",
              position: "relative",
            }}
            onMouseEnter={e => {
              if (!active) {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#FBF1E0"
                ;(e.currentTarget as HTMLElement).style.color = "#33100E"
              }
            }}
            onMouseLeave={e => {
              if (!active) {
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"
                ;(e.currentTarget as HTMLElement).style.color = "#5C2620"
              }
            }}
          >
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <Icon style={{ width: "16px", height: "16px" }} />
              {showBadge && (
                <span style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                  backgroundColor: "#dc2626",
                  color: "white",
                  borderRadius: "999px",
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  minWidth: "16px",
                  height: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 3px",
                }}>
                  {pendingCount}
                </span>
              )}
            </div>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
