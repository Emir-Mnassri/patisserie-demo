"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Cake,
  ShoppingBag,
  MessageSquare,
} from "lucide-react"

const navItems = [
  { href: "/admin/products", label: "Produits", icon: Cake },
  { href: "/admin/orders", label: "Commandes", icon: ShoppingBag },
  { href: "/admin/requests", label: "Demandes sur mesure", icon: MessageSquare },
  { href: "/admin/analytics", label: "Analytiques", icon: LayoutDashboard },
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <nav className="flex flex-col gap-1 p-3">
      {navItems.map((item) => {
        const Icon = item.icon
        const active = pathname.startsWith(item.href)
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
            <Icon style={{ width: "16px", height: "16px" }} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
