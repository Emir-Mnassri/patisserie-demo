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
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-neutral-900 text-white"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
